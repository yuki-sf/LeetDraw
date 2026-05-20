// 1. Core State Architecture
let isDrawingActive = false;
let isDrawing = false;
let canvasVisible = true;
let currentTool = 'pen'; 
let strokeColor = '#3b82f6';
let startX = 0, startY = 0;
let shapes = []; 
let undoStack = []; 
let redoStack = []; 
let currentPoints = []; 
let laserPoints = []; 

// Unique ID retrieval for each individual LeetCode Question
function getProblemKey() {
  const pathSegments = window.location.pathname.split('/');
  const problemsIndex = pathSegments.indexOf('problems');
  if (problemsIndex !== -1 && pathSegments[problemsIndex + 1]) {
    return `leetdraw_${pathSegments[problemsIndex + 1]}`;
  }
  return 'leetdraw_global_fallback';
}

// 2. Setup Canvas Environment
const canvas = document.createElement('canvas');
canvas.id = 'leetdraw-canvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Safe SVG Dom Creator Wrapper Engine
function createSvgIcon(paths, viewBox = "0 0 24 24") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  
  paths.forEach(pAttrs => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", pAttrs.tag);
    for (const key in pAttrs.attr) {
      el.setAttribute(key, pAttrs.attr[key]);
    }
    svg.appendChild(el);
  });
  return svg;
}

// Full Native Inline Icon Packs
const ICONS = {
  eye: [{ tag: "path", attr: { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" } }, { tag: "circle", attr: { cx: "12", cy: "12", r: "3" } }],
  eyeOff: [{ tag: "path", attr: { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" } }, { tag: "line", attr: { x1: "1", y1: "1", x2: "23", y2: "23" } }],
  power: [{ tag: "path", attr: { d: "M18.36 6.64a9 9 0 1 1-12.73 0" } }, { tag: "line", attr: { x1: "12", y1: "2", x2: "12", y2: "12" } }],
  pen: [{ tag: "path", attr: { d: "M12 20h9" } }, { tag: "path", attr: { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" } }],
  eraser: [{ tag: "path", attr: { d: "M20 20H4" } }, { tag: "path", attr: { d: "M20 13l-7-7-9.5 9.5a2.5 2.5 0 0 0 0 3.5L7 20l13-7z" } }],
  line: [{ tag: "line", attr: { x1: "5", y1: "19", x2: "19", y2: "5" } }],
  arrow: [{ tag: "line", attr: { x1: "5", y1: "19", x2: "19", y2: "5" } }, { tag: "polyline", attr: { points: "12 5 19 5 19 12" } }],
  rect: [{ tag: "rect", attr: { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" } }],
  circle: [{ tag: "circle", attr: { cx: "12", cy: "12", r: "10" } }],
  laser: [{ tag: "circle", attr: { cx: "12", cy: "12", r: "3", fill: "currentColor" } }, { tag: "path", attr: { d: "M3 12h1M20 12h1M12 3v1M12 20v1" } }],
  text: [{ tag: "polyline", attr: { points: "4 7 4 4 20 4 20 7" } }, { tag: "line", attr: { x1: "12", y1: "4", x2: "12", y2: "20" } }, { tag: "line", attr: { x1: "9", y1: "20", x2: "15", y2: "20" } }],
  table: [{ tag: "rect", attr: { x: "3", y: "3", width: "18", height: "18", rx: "1" } }, { tag: "line", attr: { x1: "3", y1: "12", x2: "21", y2: "12" } }, { tag: "line", attr: { x1: "12", y1: "3", x2: "12", y2: "21" } }],
  undo: [{ tag: "path", attr: { d: "M3 7v6h6" } }, { tag: "path", attr: { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" } }],
  redo: [{ tag: "path", attr: { d: "M21 7v6h-6" } }, { tag: "path", attr: { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" } }],
  clear: [{ tag: "polyline", attr: { points: "3 6 5 6 21 6" } }, { tag: "path", attr: { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" } }],
  save: [{ tag: "path", attr: { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" } }, { tag: "polyline", attr: { points: "17 21 17 13 7 13 7 21" } }, { tag: "polyline", attr: { points: "7 3 7 8 15 8" } }],
  
  rowIcon: [{ tag: "line", attr: { x1: "3", y1: "6", x2: "21", y2: "6" } }, { tag: "line", attr: { x1: "3", y1: "12", x2: "21", y2: "12" } }, { tag: "line", attr: { x1: "3", y1: "18", x2: "21", y2: "18" } }],
  colIcon: [{ tag: "line", attr: { x1: "6", y1: "3", x2: "6", y2: "21" } }, { tag: "line", attr: { x1: "12", y1: "3", x2: "12", y2: "21" } }, { tag: "line", attr: { x1: "18", y1: "3", x2: "18", y2: "21" } }]
};

// 3. Render Floating Toolbar Structure
const toolbar = document.createElement('div');
toolbar.id = 'leetdraw-toolbar';

const buttonsConfig = [
  { id: 'tool-visibility', title: 'Hide/Show Toolbar', icon: 'eye', class: 'ld-btn' },
  { type: 'divider' },
  { id: 'tool-toggle', title: 'Toggle Draw Mode', icon: 'power', class: 'ld-btn tool-element' },
  { type: 'divider' },
  { id: 'tool-pen', title: 'Pen', icon: 'pen', class: 'ld-btn tool-element active-tool' },
  { id: 'tool-eraser', title: 'Stroke Eraser', icon: 'eraser', class: 'ld-btn tool-element' },
  { type: 'divider' },
  { id: 'tool-laser', title: 'Laser Pointer', icon: 'laser', class: 'ld-btn tool-element' },
  { id: 'tool-text', title: 'Add Text Element', icon: 'text', class: 'ld-btn tool-element' },
  { id: 'tool-line', title: 'Line Tool', icon: 'line', class: 'ld-btn tool-element' },
  { id: 'tool-arrow', title: 'Arrow Pointer Tool', icon: 'arrow', class: 'ld-btn tool-element' },
  { id: 'tool-rect', title: 'Rectangle', icon: 'rect', class: 'ld-btn tool-element' },
  { id: 'tool-circle', title: 'Circle', icon: 'circle', class: 'ld-btn tool-element' },
  { id: 'tool-table', title: 'Draw Table Object', icon: 'table', class: 'ld-btn tool-element' },
  
  { type: 'visual-input', icon: 'rowIcon', value: '2', inputId: 'table-rows', title: 'Table Rows Count' },
  { type: 'visual-input', icon: 'colIcon', value: '3', inputId: 'table-cols', title: 'Table Columns Count' },
  
  { type: 'divider' },
  { id: 'tool-undo', title: 'Undo (Ctrl+Z)', icon: 'undo', class: 'ld-btn tool-element' },
  { id: 'tool-redo', title: 'Redo (Ctrl+Y)', icon: 'redo', class: 'ld-btn tool-element' },
  { type: 'divider' },
  { id: 'color-picker-wrapper', type: 'color' },
  { id: 'tool-clear', title: 'Clear Canvas', icon: 'clear', class: 'ld-btn tool-element' },
  { id: 'tool-save', title: 'Save Screenshot', icon: 'save', class: 'ld-btn tool-element' }
];

buttonsConfig.forEach(cfg => {
  if (cfg.type === 'divider') {
    const div = document.createElement('div');
    div.className = 'ld-divider tool-element';
    toolbar.appendChild(div);
  } else if (cfg.type === 'color') {
    const wrap = document.createElement('div');
    wrap.className = 'color-wrapper tool-element';
    wrap.innerHTML = `<input type="color" id="tool-color" value="#3b82f6">`;
    toolbar.appendChild(wrap);
  } else if (cfg.type === 'visual-input') {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-input-container tool-element';
    wrapper.title = cfg.title;
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.background = '#252529';
    wrapper.style.borderRadius = '8px';
    wrapper.style.width = '36px';   
    wrapper.style.height = '36px';  
    wrapper.style.border = '1px solid #3f3f46';
    wrapper.style.color = '#a1a1aa';
    wrapper.style.position = 'relative';

    const iconSvg = createSvgIcon(ICONS[cfg.icon]);
    iconSvg.setAttribute("width", "11");
    iconSvg.setAttribute("height", "11");
    iconSvg.style.opacity = "0.5";
    iconSvg.style.marginTop = "2px";

    const input = document.createElement('input');
    input.type = 'number';
    input.id = cfg.inputId;
    input.value = cfg.value;
    input.min = '1';
    input.max = '10';
    input.style.width = '100%';
    input.style.background = 'transparent';
    input.style.border = 'none';
    input.style.color = '#ffffff';
    input.style.fontFamily = 'monospace';
    input.style.fontSize = '11px';
    input.style.fontWeight = 'bold';
    input.style.textAlign = 'center';
    input.style.outline = 'none';
    input.style.padding = '0';
    input.style.marginBottom = '2px';

    wrapper.appendChild(iconSvg);
    wrapper.appendChild(input);
    toolbar.appendChild(wrapper);
  } else {
    const btn = document.createElement('button');
    btn.id = cfg.id;
    btn.className = cfg.class;
    btn.title = cfg.title;
    btn.appendChild(createSvgIcon(ICONS[cfg.icon]));
    toolbar.appendChild(btn);
  }
});
document.body.appendChild(toolbar);

// Chrome Storage Sync Save Manager
function saveShapesToStorage() {
  const key = getProblemKey();
  const data = {};
  data[key] = shapes;
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.set(data);
  }
}

// Initial Load Engine Sequence
function loadShapesFromStorage() {
  const key = getProblemKey();
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get([key], (result) => {
      if (result && result[key]) {
        shapes = result[key];
        redrawAll();
      }
    });
  }
}

// History Commit Helper Logic
function pushToHistory(newShapesArray) {
  undoStack.push(JSON.stringify(shapes));
  shapes = newShapesArray;
  redoStack = []; 
  redrawAll();
  saveShapesToStorage(); // Auto-save on any change!
}

function executeUndo() {
  if (undoStack.length === 0) return;
  redoStack.push(JSON.stringify(shapes));
  shapes = JSON.parse(undoStack.pop());
  redrawAll();
  saveShapesToStorage();
}

function executeRedo() {
  if (redoStack.length === 0) return;
  undoStack.push(JSON.stringify(shapes));
  shapes = JSON.parse(redoStack.pop());
  redrawAll();
  saveShapesToStorage();
}

// Math Utility - Point to segment calculations
function distanceToSegment(p, v, w) {
  const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
  if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt(Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) + Math.pow(p.y - (v.y + t * (w.y - v.y)), 2));
}

// Render Engine Canvas Pipeline
function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!canvasVisible) return;

  shapes.forEach(shape => {
    ctx.beginPath();
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (shape.type === 'pen') {
      if (shape.points.length < 2) return;
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) ctx.lineTo(shape.points[i].x, shape.points[i].y);
      ctx.stroke();
    } else if (shape.type === 'line') {
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    } else if (shape.type === 'arrow') {
      drawArrow(shape.x1, shape.y1, shape.x2, shape.y2);
    } else if (shape.type === 'rect') {
      ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    } else if (shape.type === 'circle') {
      ctx.arc(shape.cx, shape.cy, shape.r, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shape.type === 'text') {
      ctx.font = '16px monospace';
      ctx.fillText(shape.text, shape.x, shape.y);
    } else if (shape.type === 'table') {
      drawGrid(shape.x, shape.y, shape.w, shape.h, shape.rows, shape.cols);
    }
  });

  if (laserPoints.length > 0) {
    ctx.beginPath();
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff3333';
    for (let i = 0; i < laserPoints.length; i++) {
      if (i === 0) ctx.moveTo(laserPoints[i].x, laserPoints[i].y);
      else ctx.lineTo(laserPoints[i].x, laserPoints[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; 
  }
}

function drawArrow(x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = 12;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawGrid(x, y, w, h, rows, cols) {
  ctx.strokeRect(x, y, w, h);
  const rowHeight = h / rows;
  const colWidth = w / cols;
  for (let i = 1; i < rows; i++) {
    ctx.beginPath(); ctx.moveTo(x, y + i * rowHeight); ctx.lineTo(x + w, y + i * rowHeight); ctx.stroke();
  }
  for (let j = 1; j < cols; j++) {
    ctx.beginPath(); ctx.moveTo(x + j * colWidth, y); ctx.lineTo(x + j * colWidth, y + h); ctx.stroke();
  }
}

// 4. Interface Events Implementation
const visibilityBtn = document.getElementById('tool-visibility');
const toggleBtn = document.getElementById('tool-toggle');
const colorPicker = document.getElementById('tool-color');

visibilityBtn.addEventListener('click', () => {
  toolbar.classList.toggle('minimized');
  visibilityBtn.innerHTML = '';
  if (toolbar.classList.contains('minimized')) {
    visibilityBtn.appendChild(createSvgIcon(ICONS.eyeOff));
    canvasVisible = false;
  } else {
    visibilityBtn.appendChild(createSvgIcon(ICONS.eye));
    canvasVisible = true;
  }
  redrawAll();
});

toggleBtn.addEventListener('click', () => {
  isDrawingActive = !isDrawingActive;
  if (isDrawingActive) {
    canvas.classList.add('active');
    toggleBtn.classList.add('active-mode');
  } else {
    canvas.classList.remove('active');
    toggleBtn.classList.remove('active-mode');
    isDrawing = false;
  }
});

const tools = ['pen', 'eraser', 'laser', 'text', 'line', 'arrow', 'rect', 'circle', 'table'];
tools.forEach(tool => {
  document.getElementById(`tool-${tool}`).addEventListener('click', (e) => {
    tools.forEach(t => document.getElementById(`tool-${t}`).classList.remove('active-tool'));
    currentTool = tool;
    e.target.closest('.ld-btn').classList.add('active-tool');
  });
});

colorPicker.addEventListener('input', (e) => {
  strokeColor = e.target.value;
  e.target.parentElement.style.borderColor = strokeColor;
});

document.getElementById('tool-undo').addEventListener('click', executeUndo);
document.getElementById('tool-redo').addEventListener('click', executeRedo);

// Native Keyboard Shortcuts Binding
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    executeUndo();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    e.preventDefault();
    executeRedo();
  }
});

document.getElementById('tool-clear').addEventListener('click', () => {
  pushToHistory([]);
});

document.getElementById('tool-save').addEventListener('click', async () => {
  // 1. Hide the drawing toolbar so it doesn't clip into the screenshot
  toolbar.style.setProperty('display', 'none', 'important');
  
  // Give the browser a moment to repaint without the toolbar
  await new Promise(r => setTimeout(r, 150)); 

  try {
    // 2. Use optimal rendering flags to force icon alignments and match high-DPI displays
    const bodyCanvas = await html2canvas(document.body, {
      useCORS: true,            // Fixes cross-origin icon/image loading issues
      allowTaint: true,         // Allows fallback rendering for secure canvases
      logging: false,
      scale: window.devicePixelRatio || 2, // Matches display resolution for sharpness
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: 0,
      scrollY: 0,
      x: window.scrollX,
      y: window.scrollY,
      onclone: (clonedDoc) => {
        // Fix for misplaced absolute/fixed headers or dynamic bars during cloning
        const targetToolbar = clonedDoc.getElementById('leetdraw-toolbar');
        if (targetToolbar) targetToolbar.style.display = 'none';
      }
    });

    // 3. Create a master merging canvas
    const mergeCanvas = document.createElement('canvas');
    mergeCanvas.width = canvas.width;
    mergeCanvas.height = canvas.height;
    const mergeCtx = mergeCanvas.getContext('2d');

    // 4. Draw background layout and overlay sketches smoothly
    mergeCtx.drawImage(bodyCanvas, 0, 0, canvas.width, canvas.height);
    mergeCtx.drawImage(canvas, 0, 0);

    // 5. Trigger download pipeline
    const link = document.createElement('a');
    link.download = `${getProblemKey()}_complete.png`;
    link.href = mergeCanvas.toDataURL('image/png');
    link.click();

  } catch (err) {
    console.error("DOM capture pipeline failed, falling back to sketch-only save:", err);
    
    // Safety Fallback
    const link = document.createElement('a');
    link.download = `${getProblemKey()}_sketch.png`;
    link.href = canvas.toDataURL();
    link.click();
  } finally {
    // 6. Always bring the toolbar back into view
    toolbar.style.setProperty('display', 'flex', 'important');
  }
});

// 5. Drawing & Dragging Calculation Routines
canvas.addEventListener('mousedown', (e) => {
  if (!isDrawingActive || !canvasVisible) return;
  startX = e.clientX;
  startY = e.clientY;

  if (currentTool === 'text') {
    const activeInput = document.querySelector('.leetdraw-text-input');
    if (activeInput) {
      activeInput.blur();
      return;
    }
    spawnTextInput(startX, startY);
    return;
  }

  isDrawing = true;
  if (currentTool === 'pen') {
    currentPoints = [{ x: startX, y: startY }];
  } else if (currentTool === 'laser') {
    laserPoints = [{ x: startX, y: startY }];
  } else if (currentTool === 'eraser') {
    handleEraseAt(startX, startY);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawingActive || !canvasVisible) return;
  const currentX = e.clientX;
  const currentY = e.clientY;

  if (!isDrawing) return;

  if (currentTool === 'eraser') {
    handleEraseAt(currentX, currentY);
    return;
  }

  if (currentTool === 'laser') {
    laserPoints.push({ x: currentX, y: currentY });
    if (laserPoints.length > 25) laserPoints.shift();
    redrawAll();
    return;
  }

  redrawAll();
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = strokeColor;
  ctx.lineWidth = 3;

  if (currentTool === 'pen') {
    currentPoints.push({ x: currentX, y: currentY });
    ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
    for (let i = 1; i < currentPoints.length; i++) ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
    ctx.stroke();
  } else if (currentTool === 'line') {
    ctx.moveTo(startX, startY); ctx.lineTo(currentX, currentY); ctx.stroke();
  } else if (currentTool === 'arrow') {
    drawArrow(startX, startY, currentX, currentY);
  } else if (currentTool === 'rect') {
    ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
  } else if (currentTool === 'circle') {
    let radius = Math.sqrt(Math.pow(startX - currentX, 2) + Math.pow(startY - currentY, 2));
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI); ctx.stroke();
  } else if (currentTool === 'table') {
    const r = parseInt(document.getElementById('table-rows').value) || 2;
    const c = parseInt(document.getElementById('table-cols').value) || 3;
    drawGrid(startX, startY, currentX - startX, currentY - startY, r, c);
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;
  isDrawing = false;
  const endX = e.clientX;
  const endY = e.clientY;

  if (currentTool === 'laser') {
    let fadeInterval = setInterval(() => {
      if (laserPoints.length > 0) {
        laserPoints.shift();
        redrawAll();
      } else {
        clearInterval(fadeInterval);
      }
    }, 30);
    return;
  }

  let localCopy = [...shapes];

  if (currentTool === 'pen' && currentPoints.length > 1) {
    localCopy.push({ type: 'pen', points: currentPoints, color: strokeColor });
    pushToHistory(localCopy);
  } else if (currentTool === 'line') {
    localCopy.push({ type: 'line', x1: startX, y1: startY, x2: endX, y2: endY, color: strokeColor });
    pushToHistory(localCopy);
  } else if (currentTool === 'arrow') {
    localCopy.push({ type: 'arrow', x1: startX, y1: startY, x2: endX, y2: endY, color: strokeColor });
    pushToHistory(localCopy);
  } else if (currentTool === 'rect') {
    localCopy.push({ type: 'rect', x: startX, y: startY, w: endX - startX, h: endY - startY, color: strokeColor });
    pushToHistory(localCopy);
  } else if (currentTool === 'circle') {
    let radius = Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2));
    localCopy.push({ type: 'circle', cx: startX, cy: startY, r: radius, color: strokeColor });
    pushToHistory(localCopy);
  } else if (currentTool === 'table') {
    const r = parseInt(document.getElementById('table-rows').value) || 2;
    const c = parseInt(document.getElementById('table-cols').value) || 3;
    localCopy.push({ type: 'table', x: startX, y: startY, w: endX - startX, h: endY - startY, rows: r, cols: c, color: strokeColor });
    pushToHistory(localCopy);
  }

  currentPoints = [];
  redrawAll();
});

function spawnTextInput(x, y) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'leetdraw-text-input';
  input.style.left = `${x}px`;
  input.style.top = `${y - 10}px`;
  document.body.appendChild(input);
  
  setTimeout(() => input.focus(), 50);

  function commitText() {
    if (input.value.trim() !== '') {
      let localCopy = [...shapes];
      localCopy.push({ type: 'text', text: input.value, x: x, y: y + 6, color: strokeColor });
      pushToHistory(localCopy);
    }
    if (input.parentNode && document.body.contains(input)) {
      input.parentNode.removeChild(input);
    }
  }

  input.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') {
      e.preventDefault();
      commitText(); 
    }
  });
  input.addEventListener('blur', commitText);
}

function handleEraseAt(mouseX, mouseY) {
  const clickPt = { x: mouseX, y: mouseY };
  const baseEraserThresholdPx = 14;
  let shapeTargetIndex = -1;

  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (shape.type === 'pen') {
      for (let j = 0; j < shape.points.length - 1; j++) {
        if (distanceToSegment(clickPt, shape.points[j], shape.points[j + 1]) < baseEraserThresholdPx) { shapeTargetIndex = i; break; }
      }
    } else if (shape.type === 'line' || shape.type === 'arrow') {
      if (distanceToSegment(clickPt, { x: shape.x1, y: shape.y1 }, { x: shape.x2, y: shape.y2 }) < baseEraserThresholdPx) shapeTargetIndex = i;
    } else if (shape.type === 'rect' || shape.type === 'table') {
      const t = distanceToSegment(clickPt, { x: shape.x, y: shape.y }, { x: shape.x + shape.w, y: shape.y }) < baseEraserThresholdPx;
      const b = distanceToSegment(clickPt, { x: shape.x, y: shape.y + shape.h }, { x: shape.x + shape.w, y: shape.y + shape.h }) < baseEraserThresholdPx;
      const l = distanceToSegment(clickPt, { x: shape.x, y: shape.y }, { x: shape.x, y: shape.y + shape.h }) < baseEraserThresholdPx;
      const r = distanceToSegment(clickPt, { x: shape.x + shape.w, y: shape.y }, { x: shape.x + shape.w, y: shape.y + shape.h }) < baseEraserThresholdPx;
      if (t || b || l || r) shapeTargetIndex = i;
    } else if (shape.type === 'circle') {
      const dist = Math.sqrt(Math.pow(clickPt.x - shape.cx, 2) + Math.pow(clickPt.y - shape.cy, 2));
      if (Math.abs(dist - shape.r) < baseEraserThresholdPx) shapeTargetIndex = i;
    } else if (shape.type === 'text') {
      if (Math.abs(clickPt.x - shape.x) < 60 && Math.abs(clickPt.y - shape.y) < baseEraserThresholdPx) shapeTargetIndex = i;
    }
    if (shapeTargetIndex !== -1) break;
  }

  if (shapeTargetIndex !== -1) {
    let localCopy = [...shapes];
    localCopy.splice(shapeTargetIndex, 1);
    pushToHistory(localCopy);
  }
}

// Kick off initialization
loadShapesFromStorage();