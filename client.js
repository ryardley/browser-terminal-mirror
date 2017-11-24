(function browser_terminal_mirror(ssl){

      if (typeof ssl === 'undefined'){
        var scripts= document.getElementsByTagName('script');
        var path= scripts[scripts.length-1].src;
        var indexOfSsl = path.indexOf('ssl=');
        ssl = (indexOfSsl === -1 ? false : path.substr(indexOfSsl + 4,4) === 'true');
      }

      var state = document.readyState;
      if(state !== 'interactive' && state !== 'complete') {
        setTimeout(browser_terminal_mirror.bind(this,ssl), 100);
        return;
      }

      if (typeof WebSocket === undefined){
        console.log('browser-terminal-mirror - websockets not available');
        return;
      }

      var protocol = ssl ? 'wss' : 'ws';

      var connection = new WebSocket(protocol + '://' + location.hostname + ':37901');
      connection.onmessage = function(e){
        var data = JSON.parse(e.data);

        var pre = document.querySelector('#browser-terminal-mirror>pre');
        if (data.line) {
          const child = document.createElement('span');
          child.innerHTML = data.line;
          pre.appendChild(child);
          pre.scrollTop = pre.scrollHeight;
        }
        if (data.removeLine) {
          pre.removeChild(pre.children[pre.children.length-1]);
        }
        if (data.isError) {
          document.querySelector('#browser-terminal-mirror').style.display = 'block';
        }

        while (pre.children.length > 300) {
          pre.removeChild(pre.children[0]);
        }
        if(data.doTheReload){
          window.location.reload(1);
        }
        //need to delete the lines over time else the browser will get bogged down
      };

      var elem = document.createElement('div');
      elem.id = 'browser-terminal-mirror';
      elem.style.display = 'block';
      elem.style.position = 'absolute';
      elem.style.top = elem.style.left = elem.style.bottom = elem.style.right = '0';
      elem.style.paddingTop = '0px';
      elem.style.zIndex = 9999999;

      var pre = document.createElement('pre');
      pre.style.backgroundColor = 'black';
      pre.style.color = '#CCC';
      pre.style.margin = '0';
      pre.style.position = 'absolute';
      pre.style.top = pre.style.left = pre.style.bottom = pre.style.right = '0px';
      pre.style.overflowY = 'scroll';
      pre.style.marginBottom = '0px';
      elem.appendChild(pre);

      document.body.appendChild(elem);

  })();
