function ChangeImage(Image, previewImg) {
    if (Image.files && Image.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(previewImg).attr('src', e.target.result);
        }
        reader.readAsDataURL(Image.files[0]);
    }
}

function menuToggleOn(){
    var element = document.querySelector("header nav ul");
    element.classList.add("toggle");
}

function menuToggleOff(){
    var element = document.querySelector("header nav ul");
    element.classList.remove("toggle");
}