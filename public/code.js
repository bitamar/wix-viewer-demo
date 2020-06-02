/* eslint-disable */
$w("#text1").text = "works";

$w("#button1").onClick(() => {
  console.log("button1 onClick level 1");
  $w("#image1").src = "https://html.com/wp-content/uploads/flamingo.jpg";
  // $w("#text1").text = $w("#image1").src;
  //
  // $w("#button1").onClick(() => {
  //   $w("#image1").src =
  //     "https://cdn.shopify.com/s/files/1/0065/4917/6438/products/a-dancing-flamingo-and-fires-of-hell-background_1024x1024@2x.jpg?v=1533918868";
  // });
});

// $w("#text1").text = $w("#image1").src;

itemsMap.set("x", "y");
