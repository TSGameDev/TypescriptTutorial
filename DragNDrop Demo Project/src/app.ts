// Project State Management
class ProjectState{
    private listeners: any[] = [];
    private projects: any[] = [];
    private static instance: ProjectState

    private constructor(){}

    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Function){
        this.listeners.push(listenerFn);
    }

    public addProject(title: string, description: string, numOfPeople: number){
        const newProject = {
            id: Math.random.toString(),
            title: title,
            description: description,
            people: numOfPeople
        };
        this.projects.push(newProject);
        for(const listenerFn of this.listeners){
            //Passes a copy of the array as Javascript arrays pass original references allowing outside manipulation which can introduce bugs.
            listenerFn(this.projects.slice());
        }
    }
}

//Validation Functionality
interface Validatable{
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable){
    let isValid = true;

    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }

    if(typeof validatableInput.value === 'string'){
        if(validatableInput.minLength != null){
            isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        }
    
        if(validatableInput.maxLength != null){
            isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
    }

    if(typeof validatableInput.value === 'number'){
        if(validatableInput.min != null){
            isValid = isValid && validatableInput.value <= validatableInput.min;
        }
    
        if(validatableInput.max != null){
            isValid = isValid && validatableInput.value >= validatableInput.max;
        }
    }

    return isValid;
}

//Autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor)
{
    const originalMethod = descriptor.value;
    //New function variable that takes the original and add the "bind(this)" method to autobind class content to event listener functions.
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

//Class that take the project list template and renders it to the screen. Project list is a section that holds a list of projects AKA there will be 2 one for holding active projects and one for holding finished.
class ProjectList{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: any[];

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = [];

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;

        ProjectState.getInstance().addListener((projects: any[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    //Function called on event listener to render the currently assigned projects to this list.
    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for(const projectItem of this.assignedProjects){
            const listItem = document.createElement('li');
            listItem.textContent = projectItem.title;
            listEl?.appendChild(listItem);
        }
    }

    //Function to fill in the template blanks with the correct content.
    private renderContent(){
        const listID = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listID;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    //Function to render/attach this created element to the DOM. This attaches "before end" of the host element closing tag AKA renders it after previously attached elements.
    private attach(){
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}

//Class that takes the forum template and renders it to the screen.
class ProjectInput{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;
        
        this.configure();
        this.attach();
    }

    //Function to collect and call validation on all the user input data.
    private gatherUserInput() : [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }

        const descriptionValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 5,
            maxLength: 100
        }

        const peopleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            min: 1,
            max: 5
        }

        if(!validate(titleValidatable) ||
           !validate(descriptionValidatable) ||
           !validate(peopleValidatable)
        ){
            alert('Invalid Input');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    //Function that is called after "submit" ID button functionality to clear the forum input boxes.
    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    //Functionality to perform when the "submit" ID button is pressed. Uses a decorator to make the "this" keyword reference the class instance via binding.
    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const [title, description, people] = userInput;
            ProjectState.getInstance().addProject(title, description, people);
            this.clearInputs();
        }
    }

    //assignes functionality to the "submit" ID button
    private configure(){
        this.element.addEventListener('submit', this.submitHandler);
    }

    //Attaches the template created element to the host element after the element has started
    private attach(){
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}



const prjinput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');