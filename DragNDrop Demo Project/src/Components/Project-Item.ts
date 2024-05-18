import Component from "./Component.js";
import * as Project from "../Modules/Project.js";
import * as DDInterfaces from "./Drag-Drop.js";
import Autobind from "../Decorators/Autobind.js";

//Class that handles the project item aka the details that make up what a project is
export default class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements DDInterfaces.Draggable
{
  private project: Project.Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} people`;
    }
  }

  constructor(hostID: string, project: Project.Project) {
    super("single-project", hostID, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("Drag End");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
