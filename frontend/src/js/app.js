import gsap from 'gsap';
import SplitText from 'gsap/SplitText';

export function loader() {
    init();
}

function init() {
    console.log("init");
    const g = {};
    window.g = g;
    gsap.registerPlugin(SplitText);

    gsap.defaults({
        ease: "elastic.out(1, 0.8)",
        duration: 1
    })
}