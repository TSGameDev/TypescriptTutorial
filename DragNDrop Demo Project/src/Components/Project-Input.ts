import Component from "./Component";
import Autobind from "../Decorators/Autobind";
import * as ProjectState from "../States/Project-State";
import * as Validator from "../Utils/Validation";

//Class that takes the forum template and renders it to the screen.
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      super("project-input", "app", true, "user-input");
  
      this.titleInputElement = this.element.querySelector(
        "#title"
      )! as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      )! as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        "#people"
      )! as HTMLInputElement;
  
      this.configure();
    }
  
    //assignes functionality to the "submit" ID button
    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
  
    renderContent() {}
  
    //Function to collect and call validation on all the user input data.
    private gatherUserInput(): [string, string, number] | void {
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;
  
      const titleValidatable: Validator.Validatable = {
        value: enteredTitle,
        required: true,
      };
  
      const descriptionValidatable: Validator.Validatable = {
        value: enteredTitle,
        required: true,
        minLength: 5,
        maxLength: 100,
      };
  
      const peopleValidatable: Validator.Validatable = {
        value: enteredTitle,
        required: true,
        min: 1,
        max: 5,
      };
  
      if (
        !Validator.validate(titleValidatable) ||
        !Validator.validate(descriptionValidatable) ||
        !Validator.validate(peopleValidatable)
      ) {
        alert("Invalid Input");
        return;
      } else {
        return [enteredTitle, enteredDescription, +enteredPeople];
      }
    }
  
    //Function that is called after "submit" ID button functionality to clear the forum input boxes.
    private clearInputs() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }
  
    //Functionality to perform when the "submit" ID button is pressed. Uses a decorator to make the "this" keyword reference the class instance via binding.
    @Autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        ProjectState.ProjectState.getInstance().addProject(title, description, people);
        this.clearInputs();
      }
    }
  }