const startRecordBtn = document.querySelector(".startRecordBtn");
const stopRecordBtn = document.querySelector(".stopRecordBtn");
const mainDiv = document.querySelector(".main-div");
var mytemplate = document.getElementById("mytemplate").innerHTML;

// checking if broswer supports getUserMedia method
if (navigator.mediaDevices.getUserMedia) {
    console.log("navigator available! Yippee!");

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function(stream) {

        // creating new instance of media recorder
        var mediaRecorder = new MediaRecorder(stream);

        // using the new instance of media recorder to start recording
        startRecordBtn.addEventListener("click", function() {
            mediaRecorder.start(); //pass arg 10ms for new blob per 10ms
            console.log("recording audio has begun!");
            console.log(mediaRecorder.state); //indicates active
            startRecordBtn.disabled = true;
            startRecordBtn.innerHTML = "Recording...";
            stopRecordBtn.disabled = false;
        });

        var chunks = [];
        // this event actually runs right at the end when we stop recording
        mediaRecorder.addEventListener("dataavailable", function(e) {
            chunks.push(e.data);
            console.log("data is available, now adding data to chunks");
            console.log(mediaRecorder.state);
        });

        // This is how we stop the recording
        stopRecordBtn.addEventListener("click", function() {
            mediaRecorder.stop();
            console.log("recording has stopped");
            stopRecordBtn.disabled = true;
            startRecordBtn.disabled = false;
        });
        // type: "audio/ogg; codecs=opus"
        // this is what the media recorder is asked to do after stopping
        // this also has all variables used by dataavailable event above
        mediaRecorder.addEventListener("stop", function() {
            var clipName = prompt("Provide a clip name for your recording");
            var myblob = new Blob(chunks, {
                type: "audio/mpeg"
            });
            console.log("the blob type is: ", myblob.type);
            var clipURL = window.URL.createObjectURL(myblob); //creating temporary url in the browser to work for

            var output = Mustache.render(mytemplate, {
                clipName: clipName,
                clipURL: clipURL
            });
            // use insertadjacenthtml here to insert output
            mainDiv.insertAdjacentHTML("beforeend", output);
        });

    }).catch(function(err) {
        console.log("An error occured: ", err);
        alert(err.name); //gives an elaborate version of the error
    });


} else {
    console.log("navigator method is unavailable in your browser");
    alert("navigator method is unavailable in your browser");
}
