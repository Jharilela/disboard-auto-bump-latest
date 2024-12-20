$("head").append(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@3/dark.css">`);
chrome.storage.sync.get(['safetymode'], function(data) {
    const safetymode = data.safetymode;
    console.log("Is Safety Mode enabled?: " + safetymode);
    if (safetymode == undefined) {
      Swal.fire({
        title: 'DISCLAIMER',
        html: `By clicking 'I agree', you understand that your server could get banned off Disboard if you use this extension. Use this at your own risk.`,
        icon: 'warning',
        confirmButtonText: '<b>I agree</b>'
      }).then(() => {
        Swal.fire(
          'Hey!',
          `Please open the extension popup (by clicking on the extension icon) at least once before using this extension.
Once you have opened the popup, please press 'OK'.`,
          'warning'
        ).then(() => {window.location = window.location});
      });
    };

    function defineTabID(ServerID) {
        var iPageTabID = sessionStorage["tabID"];
        if (iPageTabID != ServerID) {
            //var iLocalTabID = localStorage["tabID"];
            var iPageTabID = ServerID;
            localStorage["tabID"] = iPageTabID;
            sessionStorage["tabID"] = iPageTabID;
        }
    }

    var ID = sessionStorage.getItem("tabID");
    console.log(ID,'ID')
    if (!ID) {
      Swal.fire(
        'Hey!',
        'Please select the server to be auto bumped.',
        'error'
      )
    }

setTimeout(function(){ // allows the bump button to load it's timer text (00:00:00) before checking if it should be bumped - a temporary and unreliable fix to the captcha popup problem but it works ¯\_(ツ)_/¯
    const lang = $("html").attr("lang") == "en" ? "" : "/" + $("html").attr("lang").toLowerCase();
    
    $(`[href]:not(.languages > li > a):not([href^="/server/bump/"])`).attr("target", "_blank");

    var d = new Date(),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes(),
      s = (d.getSeconds()<10?'0':'') + d.getSeconds();

    Object.defineProperty(document, "hidden", { value : false});

    $(".navbar-search").append(`<a class="navbar-item" id="bump" title="Made by Theblockbuster1!">
                        <span class="icon"><span class="icon-robot"></span></span>
                        <span style="background-image: linear-gradient(to left, orange, red);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;" class="text" id="bumpcount" >Autobumper Enabled: 00:00:00</span>
                    </a>`);
    $(".tabs ul").append(`<li style="margin-left: auto;" title="${d}">
                <a>
                    <span class="icon is-small"><i class="icon-sync"></i></span>
                    <span>Page Loaded: ${h}:${m}:${s}</span>
                </a>
            </li>`);
            $("div.servers.columns div.column:has(a.button)").each(function() {
              // Create the new button element
              var newButton = $('<a class="button is-dark" id="pick"><span class="icon"><img src="data:image/gif;base64,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 "/></span></a>');
          
              // Append the new button to the .buttons.has-text-right container inside the current column
              $(this).find(".buttons.has-text-right").append(newButton);
          });
          
          

    $(document).on("click", "#pick", function () {
        $(this).attr("id", "transferring");
        defineTabID($(this).parent().find('a[href^="/server/bump/"]').attr("href").replace(RegExp(`/server/bump/`, "g"), ''));
        window.location = window.location;
    });

    if (safetymode == true) {
        var safety = Math.floor(Math.random() * 1801);
    }
    else {
        safety = 0;
    };

    try {
        var grabbedmin = Number($("[href='" + "/server/bump/" + ID + "']").attr("data-remaining"));
    }
    catch(err) {
        if (ID) {
          Swal.fire(
            'Hey!',
            'Please select the server to be auto bumped.',
            'error'
          )
        };
    };
    $(document).ready(function() {
  
      // Check if ID is defined
      if (typeof ID === 'undefined' || ID === null || ID === '') {
          console.error('ID is not defined or invalid.');
          return; // Exit early to prevent further errors
      }
  
      // Select the link element
      var linkSelector = "[href='" + "/server/bump/" + ID + "']";
      
      // Check if the element exists
      var $link = $(linkSelector);
      if ($link.length === 0) {
          console.error('Link with href "' + "/server/bump/" + ID + '" not found.');
          return; // Exit if the link does not exist
      }
  
      try {
          // Change the class of the icon
          $link.find("span i:last-of-type").attr("class", "icon-robot");
      } catch (error) {
          console.error('Error changing class of icon:', error);
      }
  
      try {
          // Set the ID of the link
          $link.attr("id", "bumpme");
      } catch (error) {
          console.error('Error setting ID of the link:', error);
      }
  
      try {
          // Remove the 'disabled' attribute and ensure the link is clickable
          $link.removeAttr("disabled");
      } catch (error) {
          console.error('Error removing "disabled" attribute:', error);
      }
  
      try {
          // Ensure pointer-events is enabled (if disabled via CSS)
          $link.css("pointer-events", "auto");
      } catch (error) {
          console.error('Error enabling pointer-events:', error);
      }
  
  });
    $("head").append(`<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`);
    $("head").append(`<style>
    @keyframes rotate {
      100% {
        transform: rotate(1turn);
      }
    }

    #bumpme {
      position: relative;
      z-index: 0;
      border-radius: 10px;
      overflow: hidden;
      cursor: not-allowed !important;
    }

    #bumpme::before {
      content: '';
      position: absolute;
      z-index: -2;
      left: -150%;
      top: -150%;
      width: 400%;
      height: 400%;
      background-color: orange;
      background-repeat: no-repeat;
      background-size: 50% 50%, 50% 50%;
      background-position: 0 0, 100% 0, 100% 100%, 0 100%;
      background-image: linear-gradient(to left, orange, red 50%),linear-gradient(to right, orange, red 50%),linear-gradient(to right, orange, red 50%),linear-gradient(to left, orange, red 50%);
      animation: rotate 4s linear infinite;
    }

    #bumpme::after {
      content: '';
      position: absolute;
      z-index: -1;
      left: 6px;
      top: 6px;
      width: calc(100% - 12px);
      height: calc(100% - 12px);
      background: white;
      border-radius: 5px;
    }
    </style>`);

    function bump() {
        try {
            $('#bumpme')[0].click();
            console.log("Bumped! - " + ID);
        }
        catch(err) {
            console.error("Bump failed... - " + ID + " - " + err);
        };
    };

    String.prototype.toHHMMSS = function () {
        if (isNaN(this)) return '--:--:--';
        var sec_num = parseInt(this, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {hours = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }

    function run(fn) {
      if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
          w = new Worker(URL.createObjectURL(new Blob(['('+fn+')()'])));
        }
        w.onmessage = function(event) {
          var numberwow = event.data - safety;
          var numberwoah = Number(grabbedmin) - numberwow;
          document.getElementById("bumpcount").innerHTML = "Autobumper Enabled: " + numberwoah.toString().toHHMMSS();
          if (isNaN(grabbedmin) && ID) {
            bump()
            w.terminate();
          } else if (numberwow == grabbedmin) {
            bump()
            w.terminate();
          } else if (isNaN(numberwoah)) {
            bump()
            w.terminate();
          }
        };
      } else {
        try {
        Swal.fire(
          'Hey!',
          'Sorry, your browser does not support Disboard Auto Bump... (try downgrading to version 0.1).',
          'error'
        )
        }
        catch(err) {
          alert("Sorry, your browser does not support Disboard Auto Bumper... (try downgrading to version 0.1)");
        };
      }
    }

    const worker = run(function() {

      var i = 0;

      function timedCount() {
        i = i + 1;
        postMessage(i);
        setTimeout(function(){timedCount()},1000);
      }

      timedCount();
    });
},3000);
});
