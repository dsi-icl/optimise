class BrowserBehaviour {
    static apply() {
        // We remove default context menu
        document.oncontextmenu = () => false;
    }
}

export default BrowserBehaviour;
