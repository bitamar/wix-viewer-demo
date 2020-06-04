/* eslint-disable */
$w("#text1").text = "works";

$w("#button1").onClick(() => {
  $w("#image1").src = "https://html.com/wp-content/uploads/flamingo.jpg";
  $w("#button1").onClick(() => {
    $w("#image1").src =
      "https://cdn.shopify.com/s/files/1/0065/4917/6438/products/a-dancing-flamingo-and-fires-of-hell-background_1024x1024@2x.jpg?v=1533918868";
  });
});

$w("#button2").onClick(() => {
  $w("#text2").text = "button2 clicked";
});
