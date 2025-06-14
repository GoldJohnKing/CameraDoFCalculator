// 获取DOM元素
const elements = {
    form: document.getElementById('dofForm'),
    sizeGroup: document.getElementById('sizeGroup'),
    pixelsGroup: document.getElementById('pixelsGroup'),
    sigmaGroup: document.getElementById('sigmaGroup'),
    sigmaInput: document.getElementById('sigmaInput'),
    toggleButton: document.getElementById('toggleMode'),
    sensorTitle: document.getElementById('sensorTitle'),
    sigmaResult: document.getElementById('sigmaResult'),
    size: document.getElementById('size'),
    pixels: document.getElementById('pixels'),
    focus: document.getElementById('focus'),
    F: document.getElementById('F'),
    L: document.getElementById('L'),
    sigma: document.getElementById('sigma'),
    dofFront: document.getElementById('dof_front'),
    dofRear: document.getElementById('dof_rear'),
    dof: document.getElementById('dof'),
    dofRange: document.getElementById('dof_range')
};

// 计算容许弥散圆直径
function calculateSigma() {
    if (elements.sigmaGroup.style.display === 'none') {
        const size = parseFloat(elements.size.value);
        const pixels = parseInt(elements.pixels.value);
        return 2 / pixels * size;
    } else {
        return parseFloat(elements.sigmaInput.value);
    }
}

// 计算景深
function calculateDepthOfField(sigma, focus, F, L) {
    const dofFront = (F * sigma * L * L) / (focus * focus + F * sigma * L);
    const dofRear = (F * sigma * L * L) / (focus * focus - F * sigma * L);
    const dof = dofFront + dofRear;
    return { dofFront, dofRear, dof };
}

// 更新结果显示
function updateResults(sigma, depthOfield = null) {
    elements.sigma.textContent = sigma.toFixed(4);
    if (depthOfield) {
        if (depthOfield.dofRear < 0) {
            elements.dofFront.textContent = (depthOfield.dofFront / 1000).toFixed(4); // 转换为米
            elements.dofRear.textContent = "+∞"; // 后景深为负值时显示为+∞
            elements.dof.textContent = `${(depthOfield.dofFront / 1000).toFixed(4)} ~ +∞`; // 总景深显示为前景深值 ~ +∞
            elements.dofRange.textContent = `${((parseFloat(elements.L.value) * 1000 - depthOfield.dofFront) / 1000).toFixed(4)} ~ +∞`; // 景深范围
        } else {
            elements.dofFront.textContent = (depthOfield.dofFront / 1000).toFixed(4); // 转换为米
            elements.dofRear.textContent = (depthOfield.dofRear / 1000).toFixed(4); // 转换为米
            elements.dof.textContent = (depthOfield.dof / 1000).toFixed(4); // 转换为米
            elements.dofRange.textContent = `${((parseFloat(elements.L.value) * 1000 - depthOfield.dofFront) / 1000).toFixed(4)} ~ ${((parseFloat(elements.L.value) * 1000 + depthOfield.dofRear) / 1000).toFixed(4)}`; // 景深范围
        }
    }
}

// 切换计算模式
function toggleCalculationMode() {
    const isSensorMode = elements.sizeGroup.style.display === 'none';
    elements.sizeGroup.style.display = isSensorMode ? 'block' : 'none';
    elements.pixelsGroup.style.display = isSensorMode ? 'block' : 'none';
    elements.sigmaGroup.style.display = isSensorMode ? 'none' : 'block';
    elements.sigmaInput.disabled = isSensorMode;
    elements.toggleButton.textContent = isSensorMode ? '切换计算模式：容许弥散圆' : '切换计算模式：传感器参数';
    elements.sensorTitle.textContent = isSensorMode ? '传感器参数' : '容许弥散圆';
    elements.sigmaResult.style.display = isSensorMode ? 'block' : 'none';
}

// 表单提交事件监听
elements.form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sigma = calculateSigma();

    const focus = parseFloat(elements.focus.value);
    const F = parseFloat(elements.F.value);
    const L = parseFloat(elements.L.value) * 1000; // 转换为毫米
    
    const depthOfField = calculateDepthOfField(sigma, focus, F, L);
    
    updateResults(sigma, depthOfField);
});

// 切换模式事件监听
elements.toggleButton.addEventListener('click', toggleCalculationMode);
