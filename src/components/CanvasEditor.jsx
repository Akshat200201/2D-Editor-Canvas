import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as FabricNS from 'fabric';
const fabric = FabricNS.fabric || FabricNS.default || FabricNS;
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Toolbar from './Toolbar';
import ShareButton from './ShareButton';
import './CanvasEditor.css';

const CanvasEditor = () => {
  const { id: sceneId } = useParams();
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState('select');
  const saveTimeoutRef = useRef(null);

  // Save canvas state to Firestore
  const saveCanvasState = useCallback(async () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const docRef = doc(db, 'canvases', sceneId);
      await setDoc(docRef, {
        canvasData: JSON.stringify(fabricCanvasRef.current.toJSON()),
        lastModified: new Date().toISOString()
      }, { merge: true });
      console.log('Canvas saved successfully');
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [sceneId]);

  // Handle canvas changes and debounce saves
  const handleCanvasChange = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCanvasState();
    }, 1000); // Debounce for 1 second
  }, [saveCanvasState]);

  // Load canvas state from Firestore
  const loadCanvasState = useCallback(async () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const docRef = doc(db, 'canvases', sceneId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.canvasData) {
          fabricCanvasRef.current.loadFromJSON(data.canvasData, () => {
            fabricCanvasRef.current.renderAll();
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } else {
        // Create new document if it doesn't exist
        await setDoc(docRef, {
          canvasData: JSON.stringify(fabricCanvasRef.current.toJSON()),
          lastModified: new Date().toISOString()
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading canvas state:', error);
      setIsLoading(false);
    }
  }, [sceneId]);

  // Initialize Fabric.js canvas
  useEffect(() => {
    console.log('Initializing canvas for sceneId:', sceneId);
    
    const initializeCanvas = () => {
      // Check if canvas element is available
      if (!canvasRef.current) {
        console.error('Canvas element not found in DOM');
        return false;
      }

      try {
        console.log('Creating Fabric.js canvas...');
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 2900,
          height: 1000,
          backgroundColor: '#ffffff',
          selection: true,
          preserveObjectStacking: true
        });

        fabricCanvasRef.current = canvas;
        console.log('Canvas created successfully');

        // Ensure the canvas container is properly positioned
        const canvasContainer = canvas.wrapperEl;
        
        if (canvasContainer) {
          canvasContainer.style.border = '2px solid #ddd';
          canvasContainer.style.borderRadius = '8px';
          canvasContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
          canvasContainer.style.backgroundColor = '#fff';
        }

        // Initialize the free drawing brush explicitly
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#000000';
        console.log('Free drawing brush initialized');

        // Set up event listeners
        canvas.on('object:modified', handleCanvasChange);
        canvas.on('object:added', handleCanvasChange);
        canvas.on('object:removed', handleCanvasChange);
        canvas.on('path:created', handleCanvasChange);

        // Load initial canvas state
        loadCanvasState();
        return true;
      } catch (error) {
        console.error('Error creating canvas:', error);
        return false;
      }
    };

    // Try to initialize canvas with retry logic
    let retryCount = 0;
    const maxRetries = 50; // Maximum 5 seconds of retries
    
    const tryInitialize = () => {
      if (initializeCanvas()) {
        console.log('Canvas initialization successful');
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Canvas initialization failed, retrying... (${retryCount}/${maxRetries})`);
        setTimeout(tryInitialize, 100);
      } else {
        console.error('Canvas initialization failed after maximum retries');
        setIsLoading(false);
      }
    };

    // Start initialization attempt
    tryInitialize();

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [sceneId, handleCanvasChange, loadCanvasState]);

  // Handle tool changes
  const handleToolChange = (tool) => {
    console.log('Changing tool to:', tool);
    setSelectedTool(tool);
    const canvas = fabricCanvasRef.current;

    // Safety check - ensure canvas is available
    if (!canvas) {
      console.warn('Canvas not available yet');
      return;
    }

    // Reset canvas state
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';

    // Ensure all objects are selectable and moveable
    canvas.getObjects().forEach(obj => {
      obj.selectable = true;
      obj.evented = true;
      obj.lockMovementX = false;
      obj.lockMovementY = false;
    });

    switch (tool) {
      case 'select':
        canvas.defaultCursor = 'default';
        canvas.selection = true;
        console.log('Select tool activated');
        break;
      case 'pen':
        canvas.isDrawingMode = true;
        canvas.selection = false; // Disable selection when drawing
        // Ensure freeDrawingBrush exists before setting properties
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = 2;
          canvas.freeDrawingBrush.color = '#000000';
          console.log('Pen tool activated with brush:', canvas.freeDrawingBrush);
        } else {
          console.warn('Free drawing brush not available, reinitializing...');
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.width = 2;
          canvas.freeDrawingBrush.color = '#000000';
          console.log('Free drawing brush recreated');
        }
        break;
      case 'rectangle':
      case 'circle':
      case 'text':
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false; // Disable selection when adding objects
        break;
      default:
        canvas.defaultCursor = 'default';
        break;
    }
  };

  // Add rectangle
  const addRectangle = () => {
    console.log('Adding rectangle...');
    if (!fabricCanvasRef.current) {
      console.error('Canvas not available for adding rectangle');
      return;
    }
    
    const rect = new fabric.Rect({
      left: Math.random() * 300 + 100, // Random position to avoid overlap
      top: Math.random() * 200 + 100,
      width: 100,
      height: 80,
      fill: '#fdfcfcff',
      stroke: '#333',
      strokeWidth: 2,
      selectable: true,
      evented: true,
      lockMovementX: false,
      lockMovementY: false
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    console.log('Rectangle added successfully');
    
    // Switch back to select tool for immediate manipulation
    setSelectedTool('select');
    handleToolChange('select');
  };

  // Add circle
  const addCircle = () => {
    if (!fabricCanvasRef.current) return;
    
    const circle = new fabric.Circle({
      left: Math.random() * 300 + 100, // Random position to avoid overlap
      top: Math.random() * 200 + 100,
      radius: 50,
      fill: '#f8fafaff',
      stroke: '#333',
      strokeWidth: 2,
      selectable: true,
      evented: true,
      lockMovementX: false,
      lockMovementY: false
    });

    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    
    // Switch back to select tool for immediate manipulation
    setSelectedTool('select');
    handleToolChange('select');
  };

  // Add text
  const addText = () => {
    if (!fabricCanvasRef.current) return;
    
    const text = new fabric.IText('Double click to edit', {
      left: Math.random() * 300 + 100, // Random position to avoid overlap
      top: Math.random() * 200 + 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#333',
      selectable: true,
      evented: true,
      lockMovementX: false,
      lockMovementY: false
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    
    // Switch back to select tool for immediate manipulation
    setSelectedTool('select');
    handleToolChange('select');
  };

  // Delete selected object
  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
    }
  };

  // Change color of selected object
  const changeColor = (color) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (activeObject) {
      // Handle different object types
      if (activeObject.type === 'path') {
        // For drawn paths (pen tool)
        activeObject.set('stroke', color);
      } else {
        // For shapes and text
        activeObject.set('fill', color);
      }
      canvas.renderAll();
      
      // Trigger save after color change
      handleCanvasChange();
    } else {
      console.log('No object selected to change color');
    }
  };

  return (
  <div className="canvas-editor">
    <div className="header">
      <h1>2D Canvas Editor</h1>
      <ShareButton sceneId={sceneId} />
    </div>

    <Toolbar
      selectedTool={selectedTool}
      onToolChange={handleToolChange}
      onAddRectangle={addRectangle}
      onAddCircle={addCircle}
      onAddText={addText}
      onDeleteSelected={deleteSelected}
      onChangeColor={changeColor}
    />

    {/* ✅ keep the canvas mounted; show a banner while data loads */}
    {isLoading && <div className="loading">Loading canvas...</div>}

    <div className="canvas-container">
      <canvas ref={canvasRef} id={`canvas-${sceneId}`} />
    </div>
  </div>
);
};

export default CanvasEditor;
