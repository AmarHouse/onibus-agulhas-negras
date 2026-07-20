import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Dados das linhas
const wk = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
const sa = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
const su = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
const hol = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
const wk8 = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00'];
const su8 = ['07:00','09:00','11:00','13:00','15:00','17:00','19:00'];
const ret8 = ['07:00','09:00','11:00','13:00','15:00','17:00','19:00','21:00'];
const sut8 = ['08:00','10:00','12:00','14:00','16:00','18:00','20:00'];
const obs = 'Horário de referência (consulte a empresa)';

function t(v) { return JSON.stringify(v); }
function line(code, name, op, tabs, fromName, toName, info, fTimes, tTimes) {
  const ft = fTimes || { weekday: wk, saturday: sa, sunday: su, holiday: hol };
  const tt = tTimes || { weekday: wk, saturday: sa, sunday: su, holiday: hol };
  return '    { code: ' + t(code) + ', name: ' + t(name) + ', operator: ' + t(op) + ', tabs: ' + t(tabs) + (info ? ', info: ' + t(info) : ', info: ' + t(obs)) + ', from: { name: ' + t(fromName) + ', times: { weekday: ' + t(ft.weekday) + ', saturday: ' + t(ft.saturday) + ', sunday: ' + t(ft.sunday) + ', holiday: ' + t(ft.holiday) + ' } }, to: { name: ' + t(toName) + ', times: { weekday: ' + t(tt.weekday) + ', saturday: ' + t(tt.saturday) + ', sunday: ' + t(tt.sunday) + ', holiday: ' + t(tt.holiday) + ' } } }';
}

const schedules = [
  // RESENDE URBANO (30 linhas)
  line('105', 'Liberdade ↔ Vicentina', 'Resende Urbano', ['resende'], 'Liberdade', 'Vicentina'),
  line('125', 'Jardim Primavera ↔ Rodoviária', 'Resende Urbano', ['resende'], 'Jardim Primavera', 'Rodoviária de Resende'),
  line('130', 'Cidade Alegria ↔ Rodoviária', 'Resende Urbano', ['resende'], 'Cidade Alegria', 'Rodoviária de Resende'),
  line('135', 'Rodoviária ↔ Primavera', 'Resende Urbano', ['resende'], 'Rodoviária de Resende', 'Primavera'),
  line('140', 'Baixada Olaria ↔ Campos Elíseos', 'Resende Urbano', ['resende'], 'Baixada Olaria', 'Campos Elíseos'),
  line('145', 'Rodoviária ↔ Fazenda da Barra II', 'Resende Urbano', ['resende'], 'Rodoviária de Resende', 'Fazenda da Barra II'),
  line('150', 'Rodoviária ↔ UERJ', 'Resende Urbano', ['resende'], 'Rodoviária de Resende', 'UERJ'),
  line('155', 'Itapuca ↔ Campos Elíseos', 'Resende Urbano', ['resende'], 'Itapuca', 'Campos Elíseos'),
  line('160', 'Ipiranga ↔ Monet', 'Resende Urbano', ['resende'], 'Ipiranga', 'Monet'),
  line('165', 'AMAN ↔ Jardim Primavera', 'Resende Urbano', ['resende'], 'AMAN', 'Jardim Primavera'),
  line('175', 'Campos Elíseos ↔ Casa da Lua', 'Resende Urbano', ['resende'], 'Campos Elíseos', 'Casa da Lua'),
  line('180', 'Rodoviária ↔ Nissan', 'Resende Urbano', ['resende'], 'Rodoviária de Resende', 'Nissan'),
  line('215', 'Surubi ↔ Morro do Cruzeiro', 'Resende Urbano', ['resende'], 'Surubi', 'Morro do Cruzeiro'),
  line('235', 'Vicentina ↔ Cabral', 'Resende Urbano', ['resende'], 'Vicentina', 'Cabral'),
  line('275', 'Jardim Primavera ↔ Paraíso', 'Resende Urbano', ['resende'], 'Jardim Primavera', 'Paraíso'),
  line('280', 'Cidade Alegria ↔ Paraíso', 'Resende Urbano', ['resende'], 'Cidade Alegria', 'Paraíso'),
  line('285', 'Jardim Primavera ↔ Vicentina', 'Resende Urbano', ['resende'], 'Jardim Primavera', 'Vicentina'),
  line('305', 'São Caetano ↔ Rodoviária', 'Resende Urbano', ['resende'], 'São Caetano', 'Rodoviária de Resende'),
  line('306', 'Cidade Alegria ↔ São Caetano', 'Resende Urbano', ['resende'], 'Cidade Alegria', 'São Caetano'),
  line('310', 'Rodoviária ↔ Capelinha', 'Resende Urbano', ['resende'], 'Rodoviária de Resende', 'Capelinha'),
  line('311', 'Parque Embaixador ↔ Rodoviária', 'Resende Urbano', ['resende'], 'Parque Embaixador', 'Rodoviária de Resende'),
  line('312', 'Boa Vista I ↔ Parque Embaixador', 'Resende Urbano', ['resende'], 'Boa Vista I', 'Parque Embaixador'),
  line('320', 'Rodoviária ↔ Visconde de Mauá', 'Resende Urbano', ['resende'], 'Rodoviária de Resende', 'Visconde de Mauá', null, { weekday: wk8, saturday: wk8, sunday: su8, holiday: su8 }, { weekday: ret8, saturday: ret8, sunday: sut8, holiday: sut8 }),
  line('321', 'Resende ↔ Rio Preto', 'Resende Urbano', ['resende'], 'Resende', 'Rio Preto', null, { weekday: wk8, saturday: wk8, sunday: su8, holiday: su8 }, { weekday: ret8, saturday: ret8, sunday: sut8, holiday: sut8 }),
  line('330', 'Rodoviária ↔ Engenheiro Passos', 'Resende Urbano', ['resende'], 'Rodoviária de Resende', 'Engenheiro Passos', null, { weekday: wk8, saturday: wk8, sunday: su8, holiday: su8 }, { weekday: ret8, saturday: ret8, sunday: sut8, holiday: sut8 }),
  line('340', 'Bulhões ↔ Rodoviária', 'Resende Urbano', ['resende'], 'Bulhões', 'Rodoviária de Resende'),
  line('371', 'Jardim Primavera ↔ Fazenda da Barra III', 'Resende Urbano', ['resende'], 'Jardim Primavera', 'Fazenda da Barra III'),
  line('372', 'Fazenda da Barra III ↔ Jardim Primavera', 'Resende Urbano', ['resende'], 'Fazenda da Barra III', 'Jardim Primavera'),
  line('505', 'Rio Preto ↔ Rodoviária', 'Resende Urbano', ['resende'], 'Rio Preto', 'Rodoviária de Resende', null, { weekday: wk8, saturday: wk8, sunday: su8, holiday: su8 }, { weekday: ret8, saturday: ret8, sunday: sut8, holiday: sut8 }),
  line('510', 'Fumaça ↔ Rodoviária', 'Resende Urbano', ['resende'], 'Fumaça', 'Rodoviária de Resende', null, { weekday: wk8, saturday: wk8, sunday: su8, holiday: su8 }, { weekday: ret8, saturday: ret8, sunday: sut8, holiday: sut8 }),

  // ITATIAIA
  line('IT01', 'Itatiaia ↔ Penedo', 'Itatiaia – Penedo', ['itatiaia','penedo'], 'Itatiaia (Rodoviária)', 'Penedo', 'G = Via Granja / M = Via Martinelli', {
    weekday: ['04:50 G','05:30 G','06:35 M','07:00 M','08:20 M','08:50 G','10:00 M','10:30 G','11:50 M','12:30 M','13:30 G','14:20 M','15:45 M','16:10 G','17:20 M','18:10 G','19:20 M','21:00 M','22:40 G','00:00 G'],
    saturday: ['05:15 G','06:35 M','07:00 M','08:20 M','10:00 G','11:50 M','13:20 G','15:40 M','17:30 M','18:10 G','19:20 M','21:00 G','22:40 M','00:00 G'],
    sunday: ['05:15 G','06:35 M','07:00 M','08:20 M','10:00 G','11:50 M','13:20 G','15:40 M','17:30 M','18:10 G','19:20 M','21:00 G','22:40 M','00:00 G'],
    holiday: ['05:15 G','06:35 M','07:00 M','08:20 M','10:00 G','11:50 M','13:20 G','15:40 M','17:30 M','18:10 G','19:20 M','21:00 G','22:40 M','00:00 G']
  }, {
    weekday: ['05:40 G','06:00 M','07:35 G','07:50 M','09:20 G','09:40 M','10:50 M','11:40 G','12:30 M','13:20 M','14:40 G','15:10 M','16:30 M','17:00 M','18:10 M','18:50 G','20:10 M','21:50 G','23:30 G','00:40 G'],
    saturday: ['06:00 M','07:30 G','07:50 M','09:20 G','10:50 M','12:30 G','14:50 G','16:30 M','17:30 G','18:20 M','19:00 G','20:00 M','21:50 G','23:30 G','00:40 G'],
    sunday: ['06:00 M','07:30 G','07:50 M','09:20 G','10:50 M','12:30 G','14:50 G','16:30 M','17:30 G','18:20 M','19:00 G','20:00 M','21:50 G','23:30 G','00:40 G'],
    holiday: ['06:00 M','07:30 G','07:50 M','09:20 G','10:50 M','12:30 G','14:50 G','16:30 M','17:30 G','18:20 M','19:00 G','20:00 M','21:50 G','23:30 G','00:40 G']
  }),
  line('IT02', 'Itatiaia ↔ Maromba (via Penedo)', 'Itatiaia Urbano', ['itatiaia'], 'Itatiaia (Rodoviária)', 'Maromba', null, { weekday: ['06:00','09:00','12:00','15:00','18:00'], saturday: ['06:00','09:00','12:00','15:00','18:00'], sunday: ['07:00','10:00','13:00','16:00','19:00'], holiday: ['07:00','10:00','13:00','16:00','19:00'] }, { weekday: ['07:00','10:00','13:00','16:00','19:00'], saturday: ['07:00','10:00','13:00','16:00','19:00'], sunday: ['08:00','11:00','14:00','17:00','20:00'], holiday: ['08:00','11:00','14:00','17:00','20:00'] }),

  // PENEDO
  line('RPE', 'Resende ↔ Penedo', 'Resende – Penedo', ['resende','penedo'], 'Resende (Rodoviária)', 'Penedo', 'G = Via Granja / M = Via Martinelli', {
    weekday: ['05:20 G','05:20 Acesso Oeste','06:30 M','06:55 M','08:00 G','10:00 M','11:00 M','12:00 M','12:40 G','13:40 M','15:15 G','16:00 M','17:00 M','18:30 M','19:30 M','20:30 G','22:40 M'],
    saturday: ['05:30 G','07:00 M','08:40 G','10:00 M','13:00 M','14:30 M','16:00 M','18:00 M','19:20 G','20:50 G'],
    sunday: ['05:30 G','07:00 M','08:40 G','10:00 M','13:00 M','14:30 M','16:00 M','18:00 M','19:20 G','20:50 G'],
    holiday: ['05:30 G','07:00 M','08:40 G','10:00 M','13:00 M','14:30 M','16:00 M','18:00 M','19:20 G','20:50 G']
  }, {
    weekday: ['05:50 M','06:20 G','07:10 M','07:50 M','09:00 M','11:00 M','12:00 M','12:40 G','13:30 M','14:30 M','16:00 M','17:00 M','18:00 G','19:30 M','20:20 G','21:20 G','23:20 G'],
    saturday: ['06:00 M','08:00 M','09:20 M','11:00 M','13:40 G','15:20 M','17:00 M','18:40 M','20:00 G','21:40 G'],
    sunday: ['06:00 M','08:00 M','09:20 M','11:00 M','13:40 G','15:20 M','17:00 M','18:40 M','20:00 G','21:40 G'],
    holiday: ['06:00 M','08:00 M','09:20 M','11:00 M','13:40 G','15:20 M','17:00 M','18:40 M','20:00 G','21:40 G']
  }),
  line('PEN', 'Penedo ↔ Rio de Janeiro', 'Cidade do Aço', ['penedo','rodoviario'], 'Rio de Janeiro (Novo Rio)', 'Penedo', null, { weekday: ['10:45','11:45','16:55','19:30'], saturday: ['10:45'], sunday: ['10:45'], holiday: ['10:45'] }, { weekday: ['08:25','14:45','15:45'], saturday: ['14:45'], sunday: ['14:45','15:45','17:25'], holiday: ['14:45','15:45','17:25'] }),
  line('MAR', 'Maromba (V. Mauá) ↔ Rio de Janeiro', 'Cidade do Aço', ['penedo','rodoviario'], 'Rio de Janeiro (Novo Rio)', 'Maromba', null, { weekday: [], saturday: [], sunday: ['19:30'], holiday: ['19:30'] }, { weekday: [], saturday: [], sunday: ['18:00'], holiday: ['18:00'] }),

  // PORTO REAL
  line('PR01', 'Porto Real (Centro) ↔ Quatis', 'Porto Real Urbano', ['porto-real','quatis'], 'Porto Real (Centro)', 'Quatis'),
  line('PR02', 'Porto Real ↔ Resende (via BR-116)', 'Porto Real Urbano', ['porto-real'], 'Porto Real (Centro)', 'Resende (Rodoviária)', null, { weekday: wk8, saturday: wk8, sunday: su8, holiday: su8 }, { weekday: ret8, saturday: ret8, sunday: sut8, holiday: sut8 }),

  // RODOVIÁRIO
  line('RJO', 'Resende ↔ Rio de Janeiro', 'Cidade do Aço', ['rodoviario'], 'Rio de Janeiro (Novo Rio)', 'Resende (Rodoviária)', null, { weekday: ['07:00','11:00','13:00','15:00','17:00','19:30'], saturday: ['07:00','11:00','13:00','15:00','17:00','19:30'], sunday: ['07:00','11:00','13:00','15:00','17:00','19:30'], holiday: ['07:00','11:00','13:00','15:00','17:00','19:30'] }, { weekday: ['07:30','09:45','12:05','15:00','16:30','19:00'], saturday: ['07:30','09:45','12:05','15:00','16:30','19:00'], sunday: ['07:30','09:45','12:05','15:00','16:30','19:00'], holiday: ['07:30','09:45','12:05','15:00','16:30','19:00'] }),
  line('RJO-EXEC', 'Resende ↔ Rio de Janeiro (Executivo)', 'Cidade do Aço', ['rodoviario'], 'Rio de Janeiro (Novo Rio)', 'Resende (Rodoviária)', null, { weekday: ['08:00','12:00','18:30'], saturday: ['08:00','12:00','18:30'], sunday: ['08:00','12:00','18:30'], holiday: ['08:00','12:00','18:30'] }, { weekday: ['07:45','11:30','16:00'], saturday: ['07:45','11:30','16:00'], sunday: ['07:45','11:30','16:00'], holiday: ['07:45','11:30','16:00'] }),
  line('RNI', 'Resende ↔ Niterói', 'Cidade do Aço', ['rodoviario'], 'Niterói (Rodoviária)', 'Resende (Rodoviária)', null, { weekday: ['18:00'], saturday: [], sunday: [], holiday: [] }, { weekday: ['06:30'], saturday: [], sunday: [], holiday: [] }),
  line('EPR', 'Engenheiro Passos ↔ Rio de Janeiro', 'Cidade do Aço', ['rodoviario'], 'Engenheiro Passos', 'Rio de Janeiro (Novo Rio)', null, { weekday: ['06:10','12:30','17:00'], saturday: ['06:10','12:30','17:00'], sunday: ['06:10','12:30','17:00'], holiday: ['06:10','12:30','17:00'] }, { weekday: ['09:15','13:30','18:00'], saturday: ['09:15','13:30','18:00'], sunday: ['09:15','13:30','18:00'], holiday: ['09:15','13:30','18:00'] }),
  line('QRI', 'Quatis / Porto Real ↔ Rio de Janeiro', 'Cidade do Aço', ['rodoviario','quatis','porto-real'], 'Rio de Janeiro (Novo Rio)', 'Quatis', null, { weekday: ['17:00'], saturday: ['07:30'], sunday: ['07:30','17:00'], holiday: ['07:30','17:00'] }, { weekday: ['06:00'], saturday: [], sunday: ['17:00'], holiday: ['17:00'] }),
];

// BUS STOPS
const stops = [
  {id:'rod-resende',name:'Rodovi\u00e1ria de Resende',lat:-22.4558,lng:-44.4467,lines:['125','130','135','145','150','180','305','310','311','320','330','340','505','510','RJO','RJO-EXEC','RNI','EPR','RPE']},
  {id:'jardim-primavera',name:'Jardim Primavera',lat:-22.4580,lng:-44.4320,lines:['125','165','275','285','371','372']},
  {id:'vicentina',name:'Vicentina',lat:-22.4670,lng:-44.4520,lines:['105','235','285']},
  {id:'cabral',name:'Cabral',lat:-22.4720,lng:-44.4420,lines:['235']},
  {id:'cidade-alegria',name:'Cidade Alegria',lat:-22.4470,lng:-44.4370,lines:['130','280','306']},
  {id:'sao-caetano',name:'S\u00e3o Caetano',lat:-22.4530,lng:-44.4580,lines:['305','306']},
  {id:'paraiso',name:'Para\u00edso',lat:-22.4620,lng:-44.4620,lines:['275','280']},
  {id:'aman',name:'AMAN',lat:-22.4220,lng:-44.4320,lines:['165']},
  {id:'ipiranga',name:'Ipiranga',lat:-22.4780,lng:-44.4470,lines:['160']},
  {id:'monet',name:'Monet',lat:-22.4830,lng:-44.4420,lines:['160']},
  {id:'itapuca',name:'Itapuca',lat:-22.4650,lng:-44.4400,lines:['155']},
  {id:'campos-eliseos',name:'Campos El\u00edseos',lat:-22.4700,lng:-44.4270,lines:['140','155','175']},
  {id:'casa-da-lua',name:'Casa da Lua',lat:-22.4750,lng:-44.4220,lines:['175']},
  {id:'uerj',name:'UERJ',lat:-22.4540,lng:-44.4370,lines:['150']},
  {id:'fazenda-barra',name:'Fazenda da Barra',lat:-22.4440,lng:-44.4300,lines:['145','371','372']},
  {id:'baixada-olaria',name:'Baixada Olaria',lat:-22.4500,lng:-44.4440,lines:['140']},
  {id:'cooperativa',name:'Cooperativa',lat:-22.4570,lng:-44.4370,lines:['125','130']},
  {id:'liberdade',name:'Liberdade',lat:-22.4600,lng:-44.4540,lines:['105']},
  {id:'morro-cruzeiro',name:'Morro do Cruzeiro',lat:-22.4640,lng:-44.4500,lines:['215']},
  {id:'surubi',name:'Surubi',lat:-22.4680,lng:-44.4570,lines:['215']},
  {id:'parque-embaixador',name:'Parque Embaixador',lat:-22.4420,lng:-44.4220,lines:['311','312']},
  {id:'boa-vista-i',name:'Boa Vista I',lat:-22.4370,lng:-44.4170,lines:['312']},
  {id:'capelinha',name:'Capelinha',lat:-22.4450,lng:-44.4470,lines:['310']},
  {id:'eng-passos',name:'Engenheiro Passos',lat:-22.4120,lng:-44.5020,lines:['330','EPR']},
  {id:'visconde-maua',name:'Visconde de Mau\u00e1',lat:-22.3520,lng:-44.5020,lines:['320']},
  {id:'rio-preto',name:'Rio Preto',lat:-22.3820,lng:-44.4520,lines:['321','505']},
  {id:'fumaca',name:'Fuma\u00e7a',lat:-22.4020,lng:-44.4620,lines:['510']},
  {id:'bulhoes',name:'Bulh\u00f5es',lat:-22.4400,lng:-44.4400,lines:['340']},
  {id:'rod-itatiaia',name:'Rodovi\u00e1ria de Itatiaia',lat:-22.5000,lng:-44.5600,lines:['IT01','IT02','EPR','PEN','MAR']},
  {id:'penedo-terminal',name:'Penedo (Rodovi\u00e1ria)',lat:-22.4230,lng:-44.5300,lines:['IT01','RPE','PEN','MAR']},
  {id:'maromba',name:'Maromba',lat:-22.3350,lng:-44.5300,lines:['IT02','MAR']},
  {id:'porto-real-centro',name:'Porto Real (Centro)',lat:-22.4200,lng:-44.2900,lines:['PR01','PR02','QRI']},
  {id:'quatis-terminal',name:'Quatis (Rodovi\u00e1ria)',lat:-22.4070,lng:-44.2580,lines:['PR01','QRI']},
];

// Full app JS
const appJS = `(function () {
  'use strict';

  const SCHEDULES = [
${schedules.join(',\n')}
  ];

  var BUS_STOPS = ${JSON.stringify(stops, null, 2).replace(/"([^"]+)":/g, '$1:')};

  const state = {
    currentTab: 'todas',
    currentDay: getCurrentDay(),
    searchQuery: '',
    gpsActive: false,
    gpsWatchId: null,
    nearestStop: null,
    theme: localStorage.getItem('busao-theme') || 'light',
    modalOpen: false
  };

  function getCurrentDay() {
    var now = new Date();
    var day = now.getDay();
    if (day === 0) return 'sunday';
    if (day === 6) return 'saturday';
    return 'weekday';
  }

  function toMinutes(t) {
    if (!t) return 0;
    var parts = t.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function getNextDepartures(schedule, day) {
    var now = new Date();
    var currentMinutes = now.getHours() * 60 + now.getMinutes();
    var results = [];
    var directions = [
      { label: schedule.from.name, times: schedule.from.times[day] || [] },
      { label: schedule.to.name, times: schedule.to.times[day] || [] }
    ];
    for (var d = 0; d < directions.length; d++) {
      var dir = directions[d];
      for (var i = 0; i < dir.times.length; i++) {
        var t = dir.times[i];
        var tm = toMinutes(t);
        if (tm >= currentMinutes) {
          results.push({ time: t, direction: dir.label, minutes: tm - currentMinutes });
          if (results.length >= 2) break;
        }
      }
      if (results.length >= 2) break;
    }
    return results;
  }

  function getVisibleSchedules() {
    var query = state.searchQuery.toLowerCase().trim();
    var filtered = [];
    for (var i = 0; i < SCHEDULES.length; i++) {
      var s = SCHEDULES[i];
      if (state.currentTab !== 'todas' && s.tabs.indexOf(state.currentTab) === -1) continue;
      if (query) {
        if (s.code.toLowerCase().indexOf(query) !== -1 ||
            s.name.toLowerCase().indexOf(query) !== -1 ||
            s.operator.toLowerCase().indexOf(query) !== -1 ||
            s.from.name.toLowerCase().indexOf(query) !== -1 ||
            s.to.name.toLowerCase().indexOf(query) !== -1 ||
            (s.info && s.info.toLowerCase().indexOf(query) !== -1)) {
          filtered.push(s);
        }
      } else {
        filtered.push(s);
      }
    }
    return filtered;
  }

  function render() {
    var container = document.getElementById('linesContainer');
    var filtered = getVisibleSchedules();
    var day = state.currentDay;
    if (filtered.length === 0) {
      var q = (state.searchQuery || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>' + (q ? 'Nenhuma linha encontrada para "' + q + '"' : 'Nenhuma linha dispon\u00edvel para este filtro') + '</p></div>';
      return;
    }
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var s = filtered[i];
      var next = getNextDepartures(s, day);
      var hasSchedules = (s.from.times[day] && s.from.times[day].length > 0) || (s.to.times[day] && s.to.times[day].length > 0);
      var fromTimes = s.from.times[day] || [];
      var toTimes = s.to.times[day] || [];
      var all = fromTimes.concat(toTimes);
      var uniqueTimes = [];
      for (var t = 0; t < all.length; t++) {
        if (uniqueTimes.indexOf(all[t]) === -1) uniqueTimes.push(all[t]);
      }
      uniqueTimes.sort();
      var limited = [];
      for (var u = 0; u < uniqueTimes.length; u++) {
        if (uniqueTimes[u] >= '05:00' && uniqueTimes[u] <= '23:00') limited.push(uniqueTimes[u]);
        if (limited.length >= 4) break;
      }
      var previewHtml = '';
      if (!hasSchedules) {
        previewHtml = '<span style="color:var(--text2);font-size:.78rem">Sem hor\u00e1rios neste dia</span>';
      } else {
        for (var p = 0; p < limited.length; p++) {
          previewHtml += '<span class="schedule-preview-item">' + limited[p] + '</span>';
        }
      }
      var nextHtml = next.length > 0 ? '<span style="margin-left:auto;font-size:.72rem;color:var(--accent);font-weight:600">' + next[0].time + '</span>' : '';
      html += '<div class="line-card" data-code="' + s.code.replace(/'/g, '&#39;').replace(/"/g, '&quot;') + '">' +
        '<div class="line-header">' +
        '<span class="line-code">' + s.code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>' +
        '<span class="line-name">' + s.name.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>' +
        '<span class="operator-badge">' + s.operator.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>' +
        '<span class="line-arrow">\u203a</span>' +
        '</div>' +
        '<div class="line-schedule-preview">' + previewHtml + nextHtml + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  function openModal(code) {
    var s = null;
    for (var i = 0; i < SCHEDULES.length; i++) {
      if (SCHEDULES[i].code === code) { s = SCHEDULES[i]; break; }
    }
    if (!s) return;
    var day = state.currentDay;
    var modal = document.getElementById('detailModal');
    var body = document.getElementById('modalBody');
    var closeBtn = document.getElementById('modalClose');

    function renderDirection(dir, side) {
      var times = dir.times[day] || [];
      var gridHtml = '';
      if (times.length === 0) {
        return '<div class="schedule-section"><div class="schedule-section-title">' + side + ': ' + dir.name.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div><p style="color:var(--text2);font-size:.82rem;padding:8px 0">Sem hor\u00e1rios neste dia</p></div>';
      }
      for (var i = 0; i < times.length; i++) {
        gridHtml += '<span class="schedule-time">' + times[i] + '</span>';
      }
      return '<div class="schedule-section"><div class="schedule-section-title">' + side + ': ' + dir.name.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div><div class="schedule-grid">' + gridHtml + '</div></div>';
    }

    var infoHtml = '';
    if (s.info) {
      infoHtml = '<div style="background:var(--surface2);border-radius:var(--radius-sm);padding:10px 12px;margin-bottom:16px;font-size:.85rem;color:var(--text2)">' + s.info.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
    }
    body.innerHTML = '<div class="modal-title">' + s.code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
      '<div class="modal-code">' + s.code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + ' \u00b7 ' + s.operator.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
      '<div class="modal-direction">' + s.name.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
      infoHtml +
      renderDirection(s.from, 'Partidas') +
      renderDirection(s.to, 'Chegadas');
    modal.classList.remove('hidden');
    state.modalOpen = true;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
    state.modalOpen = false;
    document.body.style.overflow = '';
  }

  function initModal() {
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  function initCardClicks() {
    document.getElementById('linesContainer').addEventListener('click', function (e) {
      var card = e.target.closest('.line-card');
      if (card) {
        var code = card.getAttribute('data-code');
        if (code) openModal(code);
      }
    });
  }

  function initCityTabs() {
    var bar = document.createElement('div');
    bar.className = 'city-tabs';
    bar.innerHTML = '<button class="city-btn active" data-tab="todas">Todas</button><button class="city-btn" data-tab="resende">Resende</button><button class="city-btn" data-tab="itatiaia">Itatiaia</button><button class="city-btn" data-tab="penedo">Penedo</button><button class="city-btn" data-tab="quatis">Quatis</button><button class="city-btn" data-tab="porto-real">Porto Real</button><button class="city-btn" data-tab="rodoviario">Rodovi\u00e1rio</button>';
    var buttons = bar.querySelectorAll('.city-btn');
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('active');
          btn.classList.add('active');
          state.currentTab = btn.getAttribute('data-tab');
          render();
          updateNextBusBar();
        });
      })(buttons[i]);
    }
    var daySelector = document.getElementById('daySelector');
    daySelector.parentNode.insertBefore(bar, daySelector);
  }

  function initDaySelector() {
    var buttons = document.querySelectorAll('.day-btn');
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-day') === state.currentDay);
        btn.addEventListener('click', function () {
          for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('active');
          btn.classList.add('active');
          state.currentDay = btn.getAttribute('data-day');
          render();
          updateNextBusBar();
        });
      })(buttons[i]);
    }
  }

  function initSearch() {
    var input = document.getElementById('searchInput');
    var timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.searchQuery = input.value;
        render();
      }, 200);
    });
  }

  function initGPS() {
    if (!navigator.geolocation) {
      document.getElementById('gpsStatus').textContent = 'N\u00e3o dispon\u00edvel';
      return;
    }
    var btn = document.getElementById('gpsBtn');
    var icon = document.getElementById('gpsIcon');
    var text = document.getElementById('gpsText');
    var status = document.getElementById('gpsStatus');
    btn.addEventListener('click', function () {
      if (state.gpsActive) {
        navigator.geolocation.clearWatch(state.gpsWatchId);
        state.gpsActive = false;
        state.nearestStop = null;
        btn.classList.remove('active');
        icon.textContent = '\uD83D\uDCCC';
        text.textContent = 'Usar minha localiza\u00e7\u00e3o';
        status.textContent = '';
        updateNextBusBar();
        return;
      }
      status.textContent = 'Buscando...';
      state.gpsWatchId = navigator.geolocation.watchPosition(function (pos) {
        var user = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.gpsActive = true;
        btn.classList.add('active');
        icon.textContent = '\uD83D\uDCCC';
        var nearest = null, minDist = Infinity;
        for (var i = 0; i < BUS_STOPS.length; i++) {
          var stop = BUS_STOPS[i];
          var d = haversine(user.lat, user.lng, stop.lat, stop.lng);
          if (d < minDist) { minDist = d; nearest = stop; }
        }
        state.nearestStop = nearest;
        if (nearest) {
          text.textContent = nearest.name + ' (' + minDist.toFixed(1) + 'km)';
          status.textContent = nearest.lines.join(', ');
        } else {
          text.textContent = 'Nenhum ponto pr\u00f3ximo';
          status.textContent = '';
        }
        updateNextBusBar();
      }, function (err) {
        console.error('GPS error:', err);
        state.gpsActive = false;
        btn.classList.remove('active');
        icon.textContent = '\uD83D\uDCCC';
        if (err.code === 1) {
          status.textContent = 'Permiss\u00e3o negada';
          text.textContent = 'Ative o GPS nas configura\u00e7\u00f5es';
        } else if (err.code === 2) {
          status.textContent = 'Sinal indispon\u00edvel';
          text.textContent = 'Tente novamente em \u00e1rea aberta';
        } else if (err.code === 3) {
          status.textContent = 'Tempo esgotado';
          text.textContent = 'Tente novamente';
        } else {
          status.textContent = 'Erro ao obter localiza\u00e7\u00e3o';
          text.textContent = 'Usar minha localiza\u00e7\u00e3o';
        }
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 });
    });
  }

  function haversine(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function updateNextBusBar() {
    var bar = document.getElementById('nextBusBar');
    var info = document.getElementById('nextBusInfo');
    if (!state.gpsActive || !state.nearestStop) {
      bar.classList.add('hidden');
      return;
    }
    var day = state.currentDay;
    var candidates = [];
    for (var i = 0; i < SCHEDULES.length; i++) {
      if (state.nearestStop.lines.indexOf(SCHEDULES[i].code) !== -1) {
        candidates.push(SCHEDULES[i]);
      }
    }
    var now = new Date();
    var currentMinutes = now.getHours() * 60 + now.getMinutes();
    var allNext = [];
    for (var c = 0; c < candidates.length; c++) {
      var next = getNextDepartures(candidates[c], day);
      for (var n = 0; n < next.length; n++) {
        allNext.push({ code: candidates[c].code, time: next[n].time, direction: next[n].direction, minutes: next[n].minutes });
      }
    }
    allNext.sort(function (a, b) { return a.minutes - b.minutes; });
    if (allNext.length > 0) {
      bar.classList.remove('hidden');
      info.textContent = allNext[0].code + ' \u2014 ' + allNext[0].direction + ': ' + allNext[0].time;
    } else {
      bar.classList.add('hidden');
    }
  }

  function initTheme() {
    var toggle = document.getElementById('themeToggle');
    if (state.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.textContent = '\u2600\uFE0F';
      toggle.setAttribute('aria-label', 'Alternar para tema claro');
    }
    toggle.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        state.theme = 'light';
        toggle.textContent = '\uD83C\uDF19';
        toggle.setAttribute('aria-label', 'Alternar para tema escuro');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        state.theme = 'dark';
        toggle.textContent = '\u2600\uFE0F';
        toggle.setAttribute('aria-label', 'Alternar para tema claro');
      }
      localStorage.setItem('busao-theme', state.theme);
    });
  }

  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('Service Worker registration failed:', err);
      });
    }
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = '.city-tabs{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px}.city-tabs::-webkit-scrollbar{display:none}.city-btn{flex-shrink:0;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 16px;font-size:.82rem;font-weight:500;color:var(--text2);cursor:pointer;transition:all .2s;white-space:nowrap}.city-btn:hover{border-color:var(--primary);color:var(--primary)}.city-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}.operator-badge{font-size:.65rem;color:var(--text2);background:var(--surface2);padding:3px 8px;border-radius:4px;flex-shrink:0;white-space:nowrap;font-weight:500}';
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    initTheme();
    initCityTabs();
    initDaySelector();
    initSearch();
    initGPS();
    initModal();
    initCardClicks();
    render();
    updateNextBusBar();
    registerSW();
    setInterval(function () { updateNextBusBar(); }, 30000);
  });

})();`;

writeFileSync(join(root, 'app.js'), appJS);
console.log('app.js reescrito com sucesso');
