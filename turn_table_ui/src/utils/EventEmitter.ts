import mitt from "mitt";

// Event Emitter used for events that might update multiple components
// More convenient than refactoring to use context

const eventEmitter = mitt();

export default eventEmitter;
