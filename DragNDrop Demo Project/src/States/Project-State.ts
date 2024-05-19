import * as Project from '../Modules/Project.js';

// Project State Management
type Listener<T> = (items: T[]) => void;

export class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project.Project> {
  private projects: Project.Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  public addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project.Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      Project.ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  public moveProject(projectID: string, newStatus: Project.ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectID);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      //Passes a copy of the array as Javascript arrays pass original references allowing outside manipulation which can introduce bugs.
      listenerFn(this.projects.slice());
    }
  }
}