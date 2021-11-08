# Sauces

## TODO

### Header

- header
- landing

### Hints

- pan hints
- keyword hover

### Polish

- colour scheme
- arrow gradients
- fix credits anim origin
- fix tooltip popper origin when scaled
- lerp zoom on button click
- standardise / custom icons
- add icon source to credits
- redo arrows (also update their start / dest relative to card centre)
- update virtualisation strategy
- animate arrows ?

## Issues

removed the following bit components as they no longer work with MUI v5

- "@bit/mui-org.material-ui-icons.add-rounded": "^3.9.2",
- "@bit/mui-org.material-ui-icons.close-rounded": "^3.9.2",
- "@bit/mui-org.material-ui-icons.remove-rounded": "^3.9.2",
- "@bit/mui-org.material-ui-icons.search-rounded": "^3.9.2",
- "@bit/mui-org.material-ui.tooltip": "^4.9.10",

Current Fix:

- using SVG files as ReactComponents with svgr for icons
- using react-tooltip for tooltips
