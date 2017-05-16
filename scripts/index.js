let state = {
  base: 'days',
  fileType: 'csv',
  data: [],
  pointsSum: [],        // this array contains two numbers -> 1st value is for frontend, 2nd for backend
  timeSum: [],          // this array contains two numbers -> 1st value is for frontend, 2nd for backend
  devNumbers: [1, 1]        // this array contains two numbers -> 1st value is for frontend, 2nd for backend
};

const oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("get", "./inputs/defaultInputs.json", true);
oReq.send();

function reqListener(e) {
  let plotJson = JSON.parse(this.responseText);
  state.defaults = plotJson;

  plotJson.frontend.forEach(function(name, indexPos) {
    document.getElementById('frontend_input_container').appendChild(createElement('frontend_input', name, indexPos, null, 'days'));
    state.frontendIndex = indexPos;
    let obj = {
      name: name,
      category: 'frontend',
      index: indexPos
    }
    state.data.push(obj);
    state.feIndex = indexPos;
  });

  plotJson.backend.forEach(function(name, indexPos) {
    document.getElementById('backend_input_container').appendChild(createElement('backend_input', name, indexPos, null, 'days'));
    state.backendIndex = indexPos;
    let obj = {
      name: name,
      category: 'backend',
      index: indexPos
    }
    state.data.push(obj);
    state.beIndex = indexPos;
  });

  document.getElementById('frontend_input0').children[1].focus();
  document.getElementsByClassName('title_base')[0].innerText = state.base;
  document.getElementsByClassName('title_base')[1].innerText = state.base;
  document.getElementsByClassName('title_base')[2].innerText = state.base;
  document.getElementsByClassName('title_base')[3].innerText = state.base;
};

const createElement = function(inputId, name, indexPos, estimate, base) {
  const inputField = document.createElement('div');
  const idName = inputId + indexPos
  inputField.id = idName;
  inputField.className = 'input_wrapper';

  const estimateName = document.createElement('input');
  estimateName.type = 'text';
  estimateName.className = 'estimate_name';
  estimateName.value = name;
  estimateName.placeholder = 'Enter story name';
  estimateName.addEventListener('change', function() {
    saveInputChange(idName, 'name', this.value);
  }, false);
  inputField.appendChild(estimateName);

  const estimateInput = document.createElement('input');
  estimateInput.type = 'number';
  estimateInput.className = 'estimate_input';
  estimateInput.value = estimate;
  estimateInput.setAttribute("min", 0);
  estimateInput.setAttribute("max", 30);
  estimateInput.addEventListener('change', function() {
    saveInputChange(idName, 'input', this.value);
  }, false);
  estimateInput.maxLength = 2;
  estimateInput.placeholder = '1';
  inputField.appendChild(estimateInput);

  const points = document.createElement('div');
  points.className = 'input_base';
  points.innerText = base;
  inputField.appendChild(points);

  const deleteElement = document.createElement('div');
  deleteElement.className = 'delete_estimate';
  deleteElement.addEventListener('click', function() {
    deleteEstimate(idName);
  }, false)
  inputField.appendChild(deleteElement);

  const assumptionField = document.createElement('input');
  assumptionField.type = 'text';
  assumptionField.className = 'estimate_assumption hidden';
  assumptionField.placeholder = 'Add assumptions';
  assumptionField.addEventListener('change', function() {
    saveInputChange(idName, 'assumption', this.value);
  }, false);
  inputField.appendChild(assumptionField);

  const showAssumption = document.createElement('div');
  showAssumption.className = 'show_assumption';
  showAssumption.addEventListener('click', function() {
    addAssumption(idName);
  }, false)
  inputField.appendChild(showAssumption);

  const hideAssumption = document.createElement('div');
  hideAssumption.className = 'hide_assumption hidden';
  hideAssumption.addEventListener('click', function() {
    addAssumption(idName);
  }, false)
  inputField.appendChild(hideAssumption);

  return inputField;
}

const deleteEstimate = function(estimateId) {
  document.getElementById(estimateId).remove();
  const index = parseInt(estimateId.charAt(estimateId.length - 1));
  const category = estimateId.includes('frontend') ? 'frontend' : 'backend';
  let tempArr = [];

  state.data.forEach(function(estimation, i) {
    if(index !== estimation.index || category !== estimation.category) {
      tempArr.push(estimation);
    }
  });
  state.data = tempArr;
}

const addAssumption = function(estimateId) {
  console.log(estimateId);
  const wrapper = document.getElementById(estimateId);
  console.log(wrapper.children[4].classList.value.includes('hidden'));
  if(wrapper.children[4].classList.value.includes('hidden')) {
    wrapper.children[0].classList.add('hidden');
    wrapper.children[1].classList.add('hidden');
    wrapper.children[2].classList.add('hidden');
    wrapper.children[3].classList.add('hidden');
    wrapper.children[4].classList.remove('hidden');
    wrapper.children[5].classList.add('hidden');
    wrapper.children[6].classList.remove('hidden');

    wrapper.children[4].focus();
  } else {
    wrapper.children[0].classList.remove('hidden');
    wrapper.children[1].classList.remove('hidden');
    wrapper.children[2].classList.remove('hidden');
    wrapper.children[3].classList.remove('hidden');
    wrapper.children[4].classList.add('hidden');
    wrapper.children[5].classList.remove('hidden');
    wrapper.children[6].classList.add('hidden');

    wrapper.children[1].focus();
  }
}

const addEstimate = function(tech) {
  let obj = {};
  if (tech === 'frontend') {
    state.frontendIndex = ++state.frontendIndex;
    document.getElementById('frontend_input_container').appendChild(createElement('frontend_input', null, state.frontendIndex, null, state.base));
    obj = {
      name: '',
      category: 'frontend',
      index: ++state.feIndex
    }
  } else if (tech === 'backend') {
    state.backendIndex = ++state.backendIndex;
    document.getElementById('backend_input_container').appendChild(createElement('backend_input', null, state.backendIndex, null, state.base));
    obj = {
      name: '',
      category: 'backend',
      index: ++state.beIndex
    }
  }
  state.data.push(obj);
}

const changeBase = function(baseValue) {
  state.base = baseValue;
  if (baseValue === 'days') {
    document.getElementById('points').classList.add('hidden');
    state.pointValue = 1;
    state.point = null;
  } else if (baseValue === 'points') {
    document.getElementById('points').classList.remove('hidden');
    state.pointValue = document.getElementById('point_input').value;
    state.point = 'hours';
  }

  document.getElementsByClassName('estimate_input_container')[0].innerHTML = '';
  document.getElementsByClassName('estimate_input_container')[1].innerHTML = '';

  state.data.forEach(function(estimation, index) {
    if(estimation.category === 'frontend') {
      document.getElementById('frontend_input_container').appendChild(createElement('frontend_input', estimation.name ? estimation.name : '', estimation.index, estimation.value ? estimation.value : '', baseValue));
    } else if(estimation.category === 'backend') {
      document.getElementById('backend_input_container').appendChild(createElement('backend_input', estimation.name ? estimation.name : '', estimation.index, estimation.value ? estimation.value : '', baseValue));
    }
  });

  document.getElementsByClassName('title_base')[0].innerText = baseValue;
  document.getElementsByClassName('title_base')[2].innerText = baseValue;
  baseValue === 'days' ? changePoint('days') : changePoint('hours');
}

const changePoint = function(pointBase) {
  state.point = pointBase;
  document.getElementsByClassName('title_base')[1].innerText = pointBase;
  document.getElementsByClassName('title_base')[3].innerText = pointBase;

  document.getElementById('point_input').focus();
  calculateSums();
}

const saveInputChange = function(estimateId, field, textValue) {
  const index = parseInt(estimateId.charAt(estimateId.length - 1));
  const category = estimateId.includes('frontend') ? 'frontend' : 'backend';
  let pointSumFE = 0, pointSumBE = 0, timeSumFE = 0, timeSumBE = 0;

  state.data.forEach(function(estimation, i) {
    if(index === estimation.index && category === estimation.category) {
      if(field === 'name') state.data[i].name = textValue;
      else if(field === 'input') state.data[i].value = textValue;
      else if(field === 'assumption') state.data[i].assumption = textValue;
    }
  });

  calculateSums();
}

const calculateSums = function() {
  let pointSumFE = 0, pointSumBE = 0, timeSumFE = 0, timeSumBE = 0;
  state.data.forEach(function(estimation, i) {
    if(estimation.category === 'frontend' && estimation.value) {
      pointSumFE += parseInt(estimation.value);
    } else if(estimation.category === 'backend' && estimation.value) {
      pointSumBE += parseInt(estimation.value);
    }
  });

  // calculate the points sum in frontend and backend
  state.pointsSum[0] = pointSumFE;
  state.pointsSum[1] = pointSumBE;

  // calculate the time needed from the points base value
  state.timeSum[0] = state.base === 'points' ? pointSumFE * parseInt(document.getElementById('point_input').value) / state.devNumbers[0] : pointSumFE / state.devNumbers[0] ;
  state.timeSum[1] = state.base === 'points' ? pointSumBE * parseInt(document.getElementById('point_input').value) / state.devNumbers[1] : pointSumBE / state.devNumbers[1] ;
  updateSummary();
}

const updateSummary = function() {
  document.getElementById('frontend_total').innerText = state.pointsSum[0];
  document.getElementById('backend_total').innerText = state.pointsSum[1];
  document.getElementById('fe_time_total').innerText = state.timeSum[0];
  document.getElementById('be_time_total').innerText = state.timeSum[1];
}

const updatePointValue = function(pointValue) {
  state.pointValue = pointValue;
  calculateSums();
}

const updateTimeValue = function(tech, devNumber) {
  if(tech === 'frontend') {
    state.timeSum[0] = state.timeSum[0] * state.devNumbers[0] / parseInt(devNumber);
    state.devNumbers[0] = parseInt(devNumber);
  } else if(tech === 'backend') {
    state.timeSum[1] = state.timeSum[1] * state.devNumbers[1] / parseInt(devNumber);
    state.devNumbers[1] = parseInt(devNumber);
  }
  console.log(state.devNumbers);
  updateSummary();
}

const changeTech = function(tech) {
  state.tech = tech;
  if (tech === 'frontend') {
    document.getElementById('frontend').classList.remove('hidden');
    document.getElementById('separator').classList.add('hidden');
    document.getElementById('backend').classList.add('hidden');

    document.getElementById('frontend_summary').classList.remove('hidden');
    document.getElementById('separator_summary').classList.add('hidden');
    document.getElementById('backend_summary').classList.add('hidden');
  } else if (tech === 'backend') {
    document.getElementById('backend').classList.remove('hidden');
    document.getElementById('separator').classList.add('hidden');
    document.getElementById('frontend').classList.add('hidden');

    document.getElementById('backend_summary').classList.remove('hidden');
    document.getElementById('separator_summary').classList.add('hidden');
    document.getElementById('frontend_summary').classList.add('hidden');
  } else if (tech === 'both') {
    document.getElementById('frontend').classList.remove('hidden');
    document.getElementById('separator').classList.remove('hidden');
    document.getElementById('backend').classList.remove('hidden');

    document.getElementById('frontend_summary').classList.remove('hidden');
    document.getElementById('separator_summary').classList.remove('hidden');
    document.getElementById('backend_summary').classList.remove('hidden');
  }
}

const changeDownload = function(fileType) {
  state.fileType = fileType;
}

const parseJSONToCSVStr = function(jsonData) {
  if (jsonData.length == 0) {
    return '';
  }

  let keys = Object.keys(jsonData[0]);
  let lastCategory = 'frontend';

  let csvHeader = 'Estimates\r\n\r\n';
  let columnDelimiter = ',';
  let lineDelimiter = '\n';

  let csvColumnHeader = keys.join(columnDelimiter);
  let csvStr = csvHeader + csvColumnHeader + lineDelimiter;

  jsonData.forEach(item => {
    if(lastCategory !== item.Category) {
      csvStr += '\r\n' + getFormattedSummary('frontend') + '\r\n\r\n' + csvColumnHeader + lineDelimiter;
    }
    keys.forEach((key, index) => {
      if ((index > 0) && (index < keys.length)) {
        csvStr += columnDelimiter;
      }
      csvStr += item[key];
    });
    csvStr += lineDelimiter;
    lastCategory = item.Category;
    console.log(csvStr);
  });

  csvStr += '\r\n' + getFormattedSummary('backend') + '\r\n\r\n' + getFormattedSummary('both');

  return encodeURIComponent(csvStr);;
}

getFormattedSummary = function(tech) {
  let columnDelimiter = ',';
  let totalPoints = 0, totalTime = 0, totalDevs = 0, totalString = '';

  if(tech === 'frontend') {
    totalPoints = state.pointsSum[0];
    totalTime = state.timeSum[0];
    totalDevs = state.devNumbers[0];
  } else if (tech === 'backend') {
    totalPoints = state.pointsSum[1];
    totalTime = state.timeSum[1];
    totalDevs = state.devNumbers[0];
  } else {
    totalPoints = state.pointsSum[0] + state.pointsSum[1];
    totalTime = state.timeSum[0] + state.timeSum[1];
    totalDevs = state.devNumbers[0] + state.devNumbers[1];
  }
  totalString = 'Total,' + tech + columnDelimiter + totalPoints + columnDelimiter + state.base + '\r\n';
  totalString += totalDevs + ',developers,' + totalTime + columnDelimiter + state.point;
  return totalString;
}

getFormattedJSON = function(data) {
  let json = [];
  data.forEach(function(estimation) {
    if(estimation.name && estimation.name !== '' && estimation.value && estimation.value !== '' && estimation.category === 'frontend') {
      let obj = {
        Stories: estimation.name,
        Category: estimation.category,
        Estimate: estimation.value,
        Base: state.base,
        Assumptions: estimation.assumption ? estimation.assumption : ''
      }
      json.push(obj);
    }
  });
  data.forEach(function(estimation) {
    if(estimation.name && estimation.name !== '' && estimation.value && estimation.value !== '' && estimation.category === 'backend') {
      let obj = {
        Stories: estimation.name,
        Category: estimation.category,
        Estimate: estimation.value,
        Base: state.base,
        Assumptions: estimation.assumption ? estimation.assumption : ''
      }
      json.push(obj);
    }
  });
  return json;
}

const download = function() {
  const jsonData = getFormattedJSON(state.data);

  let csvStr = parseJSONToCSVStr(jsonData);
  let dataUri = 'data:text/csv;charset=utf-8,' + csvStr;

  let exportFileDefaultName = 'data.csv';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
