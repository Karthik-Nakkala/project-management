
import type { Task, Status, Priority } from "../types";


import { users } from "./users";

//here we can keep some possible actions and objects for them

const actions = [
  'Design', 'Update', 'Write', 'Fix', 'Implement', 'Test',
  'Deploy', 'Review', 'Optimize', 'Refactor', 'Create', 'Document'
];

const objects = [
  'system', 'UI', 'database', 'API', 'documentation', 'tests',
  'component', 'feature', 'bug', 'performance', 'security', 'workflow'
];

//function for random integer blw min and max
const randomInt=(min:number,max:number):number=>{
    return Math.floor(Math.random()*(max-min+1))+min;
}

//random element from array
const randomElement=<T>(arr:T[]):T=>arr[Math.floor(Math.random()*(arr.length))]


//for random date
const randomDateString = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};


//generate the title
const generateTitle = (): string => {
  const action = randomElement(actions);
  const object = randomElement(objects);
  // Occasionally add a suffix for variety
  const suffix = Math.random() > 0.777 ? ` - ${randomElement(['v2', 'hotfix', 'urgent', 'cleanup'])}` : '';
  return `${action} ${object}${suffix}`;
};

// Generate a single task
const generateTask = (id: number, now: Date): Task => {
  const status = randomElement<Status>(['To Do', 'In Progress', 'In Review', 'Done']);
  const priority = randomElement<Priority>(['Critical', 'High', 'Medium', 'Low']);
  const assignee = randomElement(users);


// Date range: 6 months ago to 6 months from now
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const sixMonthsLater = new Date(now);
  sixMonthsLater.setMonth(now.getMonth() + 6);

// 30% chance of having no start date
  const hasStartDate = Math.random() > 0.3;
  let startDate: string | null = null;
  let dueDate: string;



  if (hasStartDate) {
    // Start date between 6 months ago and today
    const start = randomDateString(sixMonthsAgo, now);
    startDate = start;
    // Due date after start date, up to 6 months later
    const startDateObj = new Date(start);
    const minDue = startDateObj;
    dueDate = randomDateString(minDue, sixMonthsLater);
  } else {
    // No start date; due date can be anywhere in the range
    dueDate = randomDateString(sixMonthsAgo, sixMonthsLater);
  }

  // Force about 40% of tasks to be overdue (dueDate < now)
  const dueDateObj = new Date(dueDate);
  if (Math.random() < 0.4 && dueDateObj >= now) {
    // Set due date to a random date in the past (up to 6 months ago)
    const pastMax = new Date(now);
    pastMax.setDate(now.getDate() - 1); // ensure it's in the past
    dueDate = randomDateString(sixMonthsAgo, pastMax);
  }

  return {
    id: `TASK-${id}`,
    title: generateTitle(),
    status,
    priority,
    assignee,
    startDate,
    dueDate,
  };
};

// Generate at least 500 tasks (500–600)
export const generateTasks = (): Task[] => {
  const count = randomInt(500, 600);
  const now = new Date();
  const tasks: Task[] = [];
  for (let i = 1; i <= count; i++) {
    tasks.push(generateTask(i, now));
  }
  return tasks;
};