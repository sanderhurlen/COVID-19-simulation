import p5 from 'p5';

var sketch = (p: p5) => {
    let x = 400;
    let y = 600;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
        p.background(0);
        p.fill(255);
        p.rect(x, y, 50, 50);
    };
};

export default sketch;
