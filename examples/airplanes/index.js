if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

var vrView;

var scenes = {
  default: {
    image: getImageSrc('crj900/0.jpg'),
    default_yaw: 0,
    hotspots: {
      seat: {
        pitch: -16,
        yaw: 17,
        radius: 0.075,
        distance: 1
      },
      night: {
        pitch: 45,
        yaw: 0,
        radius: 0.075,
        distance: 1
      }
    },
    texts: [
      {
        text: '\u2190   20" (50cm) wide ><br>Ultra comfortable<br>Business seat<br><br>Customizable texts<br>Opportunity to upsell',
        color: 'blue',
        pitch: 25,
        yaw: 0,
        distance: 1
      }
    ]
  },
  night: {
    image: getImageSrc('crj900/0-1.jpg'),
    default_yaw: 0,
    hotspots: {
      seat: {
        pitch: -16,
        yaw: 17,
        radius: 0.075,
        distance: 1
      },
      default: {
        pitch: 45,
        yaw: 0,
        radius: 0.075,
        distance: 1
      }
    }
  },
  seat: {
    image: getImageSrc('crj900/1.jpg'),
    default_yaw: -23,
    hotspots: {
      default: {
        pitch: 7,
        yaw: -23,
        radius: 0.075,
        distance: 1
      }
    },
    texts: [/*
      {
        text: 'Injected text',
        color: 'red',
        pitch: -23,
        yaw: -4,
        distance: 1
      }
     */]
  }
};

function handleResize() {
  if (vrView) {
    vrView.iframe.setAttribute('width', window.innerWidth);
    vrView.iframe.setAttribute('height', window.innerHeight);
  }
}

function handleLoad() {
  vrView = new VRView.Player('#vrview', {
    image: getImageSrc('blank.png'),
    width: window.innerWidth,
    height: window.innerHeight,
    is_autopan_off: true
  });

  vrView.on('ready', handleReady);
  vrView.on('modechange', handleModeChange);
  vrView.on('click', handleHotspotClick);
  vrView.on('error', handleError);
  vrView.on('sceneloaded', handleSceneChange);
}

function handleReady(e) {
  //console.log('ready');
  navigateTo('default');
}

function handleModeChange(e) {
  //console.log('modechange', e.mode);
}

function handleError(e) {
  //console.log('error', 'Error! %s', e.message);
}

function handleHotspotClick(e) {
  if (e.id) {
    navigateTo(e.id);
  }
}

function handleSceneChange(e) {
  if (e.image) {
    var scene = getSceneByImage(e.image);

    if (scene) {
      // Add all the hotspots for the scene
      var hotspots = Object.keys(scene.hotspots);

      for (var i = 0; i < hotspots.length; i++) {
        var hotspotKey = hotspots[i];
        var hotspot = scene.hotspots[hotspotKey];

        vrView.addHotspot(hotspotKey, {
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          radius: hotspot.radius,
          distance: hotspot.distance
        });
      }

      var texts = scene.texts || [];

      texts.forEach(function(text) {
        vrView.addText(text);
      });
    }
  }
}

function navigateTo(id) {
  //console.log('navigateTo', id);

  // Set the image
  vrView.setContent({
    image: scenes[id].image,
    default_yaw: scenes[id].default_yaw,
    is_autopan_off: true
  });
}

function getImageSrc(image) {
  return 'images/' + image;
}

function getSceneByImage(image) {
  var keys = Object.keys(scenes);

  for (var i = 0; i < keys.length; i++) {
    if (image.endsWith(scenes[keys[i]].image)) {
      return scenes[keys[i]];
    }
  }
}

window.addEventListener('load', handleLoad, false);
window.addEventListener('resize', handleResize, false)
