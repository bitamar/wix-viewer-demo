/* eslint-disable */

$w("#button1").onClick(() => {
  $w("#text1").text = "clicked";

  setTimeout(() => {
    $w("#text1").text = "initial";
  }, 1000);
});
