export class FSM {
    static selectedNode = null;
    constructor(config) {
        this.state = config.initialState;
        this.states = config.states;
        this.selectedNode = null;
    }

    transition(event, ...args) {
        console.log(`FSM: Sending ${this.state} event ${event}`);
        const currentState = this.states[this.state];
        const transition = currentState.transitions?.[event];

        if (transition) {
            console.log(`FSM: Transitioning to ${transition.target}`);
            if (transition.action) {
                transition.action(...args);
            }

            if (currentState.actions?.onExit) {
                currentState.actions.onExit(...args);
            }

            this.state = transition.target;

            const nextState = this.states[this.state];
            if (nextState.actions?.onEnter) {
                nextState.actions.onEnter(...args);
            }
        }
    }
}