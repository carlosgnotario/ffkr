export default function classManager() {
    // Find all elements with data-object attributes
    const elements = document.querySelectorAll('[data-object]');
    console.log(elements, "elements");
    
}

class teamGrid {
    constructor(element) {
        this.element = element;
        console.log(this.element, "teamGrid");
    }
}