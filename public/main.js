const BASE_URL = "/.netlify/functions/proxy";

$(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
  });
  fetch(`${BASE_URL}?path=${encodeURIComponent("v2/state_district_wise.json")}`)
      .then(response => response.json())
      .then(function(data) {
          buildTable(data[getState(data)].districtData);
      })
      .catch(function(error) {
          console.log(error);
      });
  fetch(`${BASE_URL}?path=${encodeURIComponent("data.json")}`)
      .then(response => response.json())
      .then(function(data) {
          updateStatus(data.statewise[getState(data.statewise)]);
      })
      .catch(function(error) {
          console.log(error);
      });
  fetch(`${BASE_URL}?path=${encodeURIComponent("state_test_data.json")}`)
      .then(response => response.json())
      .then(function(data) {
          updateTesting(data.states_tested_data[getStateTest(data.states_tested_data)]);
      })
      .catch(function(error) {
          console.log(error);
      });
  fetch(`${BASE_URL}?path=${encodeURIComponent("states_daily.json")}`)
      .then(response => response.json())
      .then(function(data) {
          lastStatus(data.states_daily);
          drawChart(data.states_daily);
      })
      .catch(function(error) {
          console.log(error);
      });

  function drawChart(data) {
    var label = [];
    var confirmed = [];
    var recovered = [];
    var deceased = [];
    for (var i = data.length - 30; i <= data.length - 1; i++) {
      if (data[i].status == 'Deceased') {
        label.push(data[i].date);
        deceased.push(data[i].wb);
      }
      if (data[i].status == 'Recovered') {
        recovered.push(data[i].wb);
      }
      if (data[i].status == 'Confirmed') {
        confirmed.push(data[i].wb);
      }
    }
      var ctx = document.getElementById('weekChart').getContext('2d');
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: label,
            datasets: [{
                label: 'Confirmed',
                backgroundColor: 'rgb(54, 162, 235)',
                stack: 'Stack 0',
                data: confirmed
            },{
                label: 'Recovered',
                backgroundColor: 'rgb(75, 192, 192)',
                stack: 'Stack 0',
                data: recovered
            },{
                label: 'Deceased',
                backgroundColor: 'rgb(255, 99, 132)',
                stack: 'Stack 0',
                data: deceased
            }]
            },

        // Configuration options go here
            options: {
                title: {
                display: false,
                text: 'Last 7 days (Cumulative)'
              },
              tooltips: {
                mode: 'index',
                intersect: false
              },
              legend:
              {
                  display: false
              },
              responsive: true,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true
                            }
                        }
                    }
        });
    }
  function buildTable(data){
    var table = document.getElementById('myTable')

    for (var i = 0; i < data.length; i++){
      var row = `<tr>
              <td>${data[i].district}</td>
                            <td>${data[i].confirmed}</td>
                            <td>${data[i].active}</td>
                            <td>${data[i].recovered}</td>
                            <td>${data[i].deceased}</td>
            </tr>`
      table.innerHTML += row
    }
  }
  function lastStatus(data) {
    for (var i = data.length - 1; i >= data.length - 3; i--) {
      if (data[i].status == 'Deceased'){
        document.getElementById("lastDeceased").textContent = data[i].wb;
      }
      if (data[i].status == 'Recovered'){
        document.getElementById("lastRecovered").textContent = data[i].wb;
      }
      if (data[i].status == 'Confirmed'){
        document.getElementById("lastConfirmed").textContent = data[i].wb;
      }
    }
  }
  function getState(data) {
    for(key in data){
      if (data[key].state == 'West Bengal'){
        return key;
      }
    }
  }
  function getStateTest(data) {
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].state == 'West Bengal'){
        return i;
      }
    }
  }
  function updateStatus(data) {
    document.getElementById("statusConfirm").textContent = data.confirmed;
    document.getElementById("statusActive").textContent = data.active;
    document.getElementById("statusRecovered").textContent = data.recovered;
    document.getElementById("statusDeceased").textContent = data.deaths;
    document.getElementById("lastUpdate").textContent = data.lastupdatedtime;
  }
  function updateTesting(data) {
    document.getElementById("totalTested").textContent = data.totaltested || 'NA';
    document.getElementById("testPerm").textContent = data.testspermillion || 'NA';
    document.getElementById("testPercent").textContent = data.testpositivityrate || 'NA';
    document.getElementById('sourceLink').innerHTML = '<a href=\"' + data.source1 + '\" target="_blank">Source</a>';
  }