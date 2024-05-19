import Component from "./Component.js";
import Autobind from "../Decorators/Autobind.js";
import ProjectItem from "./Project-Item.js";
import * as Project from "../Modules/Project.js";
import * as ProjectState from "../States/Project-State.js";
import * as DDInterfaces from "./Drag-Drop.js";

//Class that take the project list template and renders it to the screen. Project list is a section that holds a list of projects AKA there will be 2 one for holding active projects and one for holding finished.
export default class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DDInterfaces.DragTarget
{
  assignedProjects: Project.Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent) {
    const prjID = event.dataTransfer!.getData("text/plain");
    ProjectState.ProjectState.getInstance().moveProject(
      prjID,
      this.type === "active" ? Project.ProjectStatus.Active : Project.ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    ProjectState.ProjectState.getInstance().addListener((projects: Project.Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === Project.ProjectStatus.Active;
        } else {
          return prj.status === Project.ProjectStatus.Finished;
        }
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  //Function to fill in the template blanks with the correct content.
  renderContent() {
    const listID = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listID;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  //Function called on event listener to render the currently assigned projects to this list.
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}
