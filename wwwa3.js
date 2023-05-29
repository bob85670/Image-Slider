window.onload = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  let left = canvas.width;
  let imgList = [];
  let currentIndex = 0;
  let prevIndex = 0;
  let toSlide = true;
  const numOfImg = images.length;

  // Cache all images during the first cycle to avoid loading images every time
  for (let i = 0; i < numOfImg; i++) {
    const img = new Image();
    img.src = "images/" + images[i];
    img.onload = () => {
      getParameters(img);
      imgList[i] = img;
      if (i == 0) transition(new Image(), imgList[0]);
    };
  }

  // Pause the slider
  canvas.onmouseover = () => {
    toSlide = false;
  };
  // Resume the slider
  canvas.onmouseleave = () => {
    toSlide = true;
  };

  // Move to the next image
  // left == 0 implies a image is fully loaded
  canvas.onmouseup = () => {
    if (left == 0) toNext();
  };

  // To move to next slide every 3s
  window.setInterval(() => {
    // if move is not over
    // and the previous image is complete slided
    // call the next image
    if (toSlide == true && left == 0) toNext();
  }, 3000);

  function toNext() {
    left = canvas.width;
    prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % numOfImg; // Next index
    transition(imgList[prevIndex], imgList[currentIndex]);
  }

  // the transition function
  function transition(prev, current) {
    if (left > 0) {
      // draw each frame recursively
      left = left - 10;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(prev, prev.centerShift_x, prev.centerShift_y, prev.width, prev.height);
      // (1 - left / canvas.width) determines the opacity, i.e. creates the fade in effect
      ctx.fillStyle = "rgba(255, 255, 255," + (1 - left / canvas.width) + ")";
      ctx.fillRect(left, 0, canvas.width - left, canvas.height);
      ctx.drawImage(current, left + current.centerShift_x, current.centerShift_y, current.width, current.height);
      window.requestAnimationFrame(() => transition(prev, current));
    }
  }

  // to get the ratio of the image and move it to center
  function getParameters(img) {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio, 1);

    img.width = ratio * img.width;
    img.height = ratio * img.height;
    img.centerShift_x = (canvas.width - img.width) / 2;
    img.centerShift_y = (canvas.height - img.height) / 2;
  }
};
