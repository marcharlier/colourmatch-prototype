# Colour matching experience prototype

This interactive prototype explores the user experience of RGB based colour matching.
It lets users explore two scenarios:

1. A user selects any RGB colour using a colour picker, and the most closely matching colour from a defined set is found and displayed.
2. A user uploads an SVG logo using various RGB colours and the logo is then recoloured using the most closely matching colours from the defined colour libray.

There are two differnet colour libraries (a larger one and a smaller one) in this prototpye to show the impact of the size of the library.
There are some pre-set SVG logo examples to play with.

<img width="657" height="401" alt="image" src="https://github.com/user-attachments/assets/3d4c4aba-f0f2-422c-a575-c2054f2facc6" />

## More context
### Current state of logo upload colour handling

When users upload an SVG graphic to an Editor, there is no option to provide CMYK print values in their SVG. Currently, we handle this by automatically replacing all colours in the graphic with print-approved colours from the palette. This means initially the uploaded logo has completely different colours to what the user has uploaded, but the user can then manually find something they like.

### What this prototype is testing

This prototype explores what it would feel like if we would automatically apply the most closely matching colours from the palette as possible.

### How does is find the closest match?

This prototype uses "Euclidian Distance" (so, essentially the distance between the three R,G,B values, sort of like Pythagoras) between two sets of RGB values (the one the user uploaded, and the ones we store as display value) to identify the closest matching colour in a set. In this case, it's using the current Rapha primary and secondary palette.

### Where could this go?

This could enable a user experience where the user is told that colours in their graphic need to be changed to print-approved colours, and starts them off with a close match - while still giving the option to change manually.

### The questions this prototype is exploring are:

Would this improve the user experience of uploading graphics?
Does matching between two RGBs (neither of which properly reference a print output even make sense does it set wrong expectations?
Is Euclidian Distance the right way to find the best match mathematically? [Probably not...](https://stackoverflow.com/questions/9018016/how-to-compare-two-colors-for-similarity-difference)
