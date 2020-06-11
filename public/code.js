/* eslint-disable */

function setCity() {
  const images = {
    Jerusalem: "/images/Jerusalem.jpg",
    "Tel Aviv-Yafo": "/images/Tel Aviv-Yafo.jpg",
  };

  const currentCity = $w("#city").value;
  console.log(currentCity);
  $w("#image1").src = images[currentCity]
    ? images[currentCity]
    : "https://static.wixstatic.com/media/11062b_3a11c4fcf7e1427ca0ac0c7fd142676e~mv2_d_5565_3710_s_4_2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01/Golf%20Cart.webp";

  $w("#iframe1").params = { city: currentCity };
}

setCity();

$w("#button2").onClick(() => {
  setCity();
  $w("#text1").text = $w("#city").value;
});
