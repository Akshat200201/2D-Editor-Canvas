import './Toolbar.css';

const Toolbar = ({
  selectedTool,
  onToolChange,
  onAddRectangle,
  onAddCircle,
  onAddText,
  onDeleteSelected,
  onChangeColor
}) => {
  const colors = [
    '#000000', '#9ca3af', '#ffffff',
    '#ef4444', '#fde047', '#10b981',
    '#06b6d4', '#6366f1', '#8b5cf6',
    '#ec4899', '#f97316', '#84cc16'
  ];

  const handlePick = (e) => {
    const val = e.target.value;
    if (val) onChangeColor(val);
  };

  return (
    <div className="toolbar">
      <div className="tool-section">
        <h3>Tools</h3>
        <div className="tool-buttons">
          <button
            className={`tool-btn ${selectedTool === 'select' ? 'active' : ''}`}
            onClick={() => onToolChange('select')}
            title="Select"
          >
            ↖️
          </button>
          <button
            className={`tool-btn ${selectedTool === 'pen' ? 'active' : ''}`}
            onClick={() => onToolChange('pen')}
            title="Pen"
          >
            ✏️
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>Shapes</h3>
        <div className="tool-buttons">
          <button
            className="tool-btn"
            onClick={onAddRectangle}
            title="Add Rectangle"
          >
            ⬛
          </button>
          <button
            className="tool-btn"
            onClick={onAddCircle}
            title="Add Circle"
          >
            ⭕
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>Text</h3>
        <div className="tool-buttons">
          <button
            className="tool-btn"
            onClick={onAddText}
            title="Add Text"
          >
            📝
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>Colors</h3>

        <div className="color-grid">
          <div className="color-row">
            {colors.slice(0, 4).map((color) => (
              <button
                key={color}
                className="color-btn"
                style={{ backgroundColor: color }}
                onClick={() => onChangeColor(color)}
                title={`Change to ${color}`}
                aria-label={`Change to ${color}`}
              />
            ))}
          </div>

          <div className="color-row">
            {colors.slice(4, 8).map((color) => (
              <button
                key={color}
                className="color-btn"
                style={{ backgroundColor: color }}
                onClick={() => onChangeColor(color)}
                title={`Change to ${color}`}
                aria-label={`Change to ${color}`}
              />
            ))}

            <label className="color-picker" title="Pick custom color" aria-label="Pick custom color">
              <input type="color" onChange={handlePick} />
              <span>Pick</span>
            </label>
          </div>
        </div>
      </div>


      <div className="tool-section">
        <h3>Actions</h3>
        <div className="tool-buttons">
          <button
            className="tool-btn delete-btn"
            onClick={onDeleteSelected}
            title="Delete Selected"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
