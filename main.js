$(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
  });
  const stateUrl = 'https://jsonbox.io/b0512bc1_4d51_4ad4_a493_99231b708385';
  fetch(stateUrl)
      .then(response => response.json())
      .then(function(data) {
          appendStatus(data[3]);
          drawChart(data[2].weekData);
          buildTable(data[1].districtData);
          document.getElementById("lastUpdate").textContent = data[0].bulletin[0].date + ", " + data[0].bulletin[0].time;
          document.getElementById('sourceLink').innerHTML = data[0].bulletin[0].link;
      })
      .catch(function(error) {
          console.log(error);
      });
  function appendStatus(data) {
      document.getElementById("statusConfirm").textContent = data.confirmed;
      document.getElementById("statusActive").textContent = data.active;
      document.getElementById("statusRecovered").textContent = data.recovered;
      document.getElementById("statusDeceased").textContent = data.deaths;
  }
  function drawChart(data) {
      var ctx = document.getElementById('weekChart').getContext('2d');
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: [data[6].date,data[5].date,data[4].date,data[3].date,data[2].date,data[1].date,data[0].date],
            datasets: [{
                label: 'Confirmed',
                backgroundColor: 'rgb(54, 162, 235)',
                stack: 'Stack 0',
                data: [data[6].confirmed,data[5].confirmed,data[4].confirmed,data[3].confirmed,data[2].confirmed,data[1].confirmed,data[0].confirmed]
            },{
                label: 'Recovered',
                backgroundColor: 'rgb(75, 192, 192)',
                stack: 'Stack 0',
                data: [data[6].recovered,data[5].recovered,data[4].recovered,data[3].recovered,data[2].recovered,data[1].recovered,data[0].recovered]
            },{
                label: 'Deceased',
                backgroundColor: 'rgb(255, 99, 132)',
                stack: 'Stack 0',
                data: [data[6].died,data[5].died,data[4].died,data[3].died,data[2].died,data[1].died,data[0].died]
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
              <td>${data[i].name}</td>
                            <td>${data[i].confirmed}</td>
                            <td>${data[i].active}</td>
                            <td>${data[i].recovered}</td>
                            <td>${data[i].died}</td>
              <td>${data[i].comorbidity}</td>
            </tr>`
      table.innerHTML += row

    }
  }