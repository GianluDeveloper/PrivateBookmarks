function scrapeThePage() {
  var htmlCode = document.documentElement.outerHTML;
  return htmlCode;
}

const handleBookmark = () => {
  /* try {
        chrome.tabs.getSelected(null, function (tab) {
			alert(tab.id);
            chrome.tabs.sendRequest(tab.id, {action: "getSource"}, function(source) {
                alert("source:",source);
            });
        });
    }
    catch (ex) {
        alert("error:",ex);
    }*/

  const test = () => {
    chrome.tabs.getSelected(null, function (tab) {
      const scriptToExec = `(${returnHtml})()`;

      chrome.tabs.executeScript(tab.id, { code: scriptToExec }, (scraped) => {
        window.Html = scraped[0];
      });
    });

    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.detectLanguage(tab.id, function (language) {
        //alert(language);
        window.Lang = language;
      });
    });

    // window.innerHeight+window.scrollY>=d.offsetHeight

    const scriptCodeCollects = `var wasAt = window.pageYOffset;var n = 0;var first = true;var scrollAll = ()=>{
			if(window.innerHeight+window.scrollY>=document.body.scrollHeight && first!=true){
				//alert("scrolled")
				return 2;
			}else{
				window.scroll(0,n)
				n=n+window.innerHeight;
			}
			first=false;
			return 1;
		};`;
    const cmd = `	scrollAll();`;
    const retTo = `window.scroll(0,wasAt);`;

    //chrome.tabs.executeScript({code : scriptCodeCollects},()=>{

    //chrome.tabs.executeScript({code : cmd},()=>{alert("scrolled")});

    //	});
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.executeScript(tab.id, { code: scriptCodeCollects }, () => {});
    });
    let counter = 0;
    window.Screens = [];
    const captureS = () => {
      chrome.tabs.captureVisibleTab(null, {}, function (image) {
        // const d = document.createElement("a");
        // d.href = image;
        // d.style.display="none"
        // d.id = "imgdl";
        // d.innerText = "okk";
        // document.body.appendChild(d)

        // document.getElementById("txt").innerHTML += image + "\n";
        window.Screens.push(image);
        counter++;

        chrome.tabs.getSelected(null, function (tab) {
          //document.getElementById("imgdl").click()
          chrome.tabs.executeScript(tab.id, { code: cmd }, (r) => {
            counter++;
            r = 2;
            if (r == 1) {
              captureS();
            } else if (r == 2) {
              chrome.tabs.getSelected(null, function () {
                chrome.tabs.executeScript(tab.id, { code: retTo });

                var query = { active: true, currentWindow: true };
                function callback(tabs) {
                  var currentTab = tabs[0];
                  var data = JSON.stringify({
                    location: currentTab,
                    time: Date(),
                    title: window.document.title,
                    lang: window.Lang,
                    html: window.Html,
                    screens: window.Screens,
                  });
                  fetch("http://localhost:3000/bookmark", {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(data),
                  })
                    .then((t) => t.json())
                    .then((tss) => {
                      const { ip } = tss;
                      window.document.querySelector("#res").innerText = ip;
                    });
                }

                chrome.tabs.query(query, callback);
              });
            }
          });
        });
      });
    };
    captureS();
  };

  test();
};

window.document.querySelector("#clickit").onclick = handleBookmark;
