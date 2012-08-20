DarkBox
=======

DarkBox is a blatant clone of the [LightBox](http://www.huddletogether.com/projects/lightbox2/) software for displaying images. It uses CSS effects wherever possible, specifically CSS3 Transitions for animation, which means it looks super hot in Firefox, Chrome, Safari, and Opera. In older browsers it just looks hot.

Example: Slideshow
------------------

To load a series of images, all you need to do is set an array of filenames to `DarkBox.list`, and call `DarkBox.show(x)` where `x` is an index in the array. To set descriptions, make `DarkBox.descriptions` an array of all the descriptions, or set individual descriptions. You can include HTML in your description.

	// list is an array of image URLs
	DarkBox.list = ["cat.jpg","telephoneboxes.jpg","dog.jpg"];
	// you can add to it programatically too
	DarkBox.list.push("cupcake.jpg");

	// descriptions is an array of descriptions, the index of each matches the appropriate image
	DarkBox.descriptions [1] = "Telephone Boxes";
	DarkBox.descriptions [3] = "<i>Individually Boxed Earth Cupcakes</i><br />by clevercupcakes";

Example: Individual image
-------------------------

DarkBox can display a single image, even if a list has been set (like on this page). Just call `DarkBox.show(src, [desc])` where `src` is an image URL and `desc` is an optional description.
