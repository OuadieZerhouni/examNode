import { form, textInput, listDiv, url } from "./config.js";
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = textInput.value;
  console.log(`sending : ${value}`);

  fetch(`${url}tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ text: value }),
  });
  FillTable();

});

const FillTable = async () => {
 listDiv.innerHTML = '';
 
 const heading = document.createElement('h2');
 heading.textContent = 'Task List';
 listDiv.append(heading);
 
 const response = await fetch(url + 'tasks');
 const taskList = await response.json();
 console.log(taskList);
 
 taskList.sort((taskA, taskB) => taskA.ordre - taskB.ordre); // Sort tasks by order
 
 const list = document.createElement('ul');
 
 for (let i = 0; i < taskList.length; i++) {
   const task = taskList[i];
 
   const listItem = document.createElement('li');
   listItem.textContent = task.text;
   const deleteButton = document.createElement('button');
   deleteButton.textContent = 'X';
   deleteButton.addEventListener('click', async () => {
     const response = await fetch(url + 'tasks/' + i, { method: 'DELETE' });
     if (response.ok) {
       listItem.remove();
     } else {
       console.log('Failed to delete task:', task);
     }
   });
 
    const upButton = document.createElement('button');
    upButton.textContent = 'Up';
upButton.addEventListener('click', async () => {
  if (i > 0) {
    const newIndex = i - 1;
    const response = await fetch(url + 'tasks/' + i, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: task.text,
        ordre: newIndex
      })
    });
    if (response.ok) {
      const temp = taskList[i - 1];
      taskList[i - 1] = taskList[i];
      taskList[i] = temp;
      FillTable();
    } else {
      console.log('Failed to move task up:', task);
    }
  }
});

const downButton = document.createElement('button');
downButton.textContent = 'Down';
downButton.addEventListener('click', async () => {
  if (i < taskList.length - 1) {
    const newIndex = i + 1;
    const response = await fetch(url + 'tasks/' + i, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: task.text,
        ordre: newIndex
      })
    });
    if (response.ok) {
      const temp = taskList[i + 1];
      taskList[i + 1] = taskList[i];
      taskList[i] = temp;
      FillTable();
    } else {
      console.log('Failed to move task down:', task);
    }
  }
});

    listItem.append(deleteButton);
    listItem.append(upButton);
    listItem.append(downButton);
    list.append(listItem);
  }

  listDiv.append(list);
};
FillTable();
