document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todo-items');
    const addItemInput = document.getElementById('new-todo-item');

    if (!todoList || !addItemInput) {
        console.error('Essential element not found!');
        return;
    }

    addItemInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const value = addItemInput.value.trim();
            if (value) {
                addTodo(value);
                addItemInput.value = '';  
            }
        }
    });

    function addTodo(Name) {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Todos/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({ name: Name }), 
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.id && data.name) { 
                createTodoElement(data.id, data.name);
            } else {
                throw new Error('Invalid todo data received');
            }
        })
        .catch(error => {
            console.error('Error adding todo:', error);
            alert('Failed to add todo: ' + error.message);
        });
    }

    function fetchTodos() {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Todos?pageNr=1&pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
               throw new Error('Failed to fetch todos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Todo data:', data); 
            todoList.innerHTML = ''; 
            data.forEach(todo => {
                createTodoElement(todo.id, todo.name); 
            });
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
            alert('Failed to load todos: ' + error.message);
        });
    }

    function createTodoElement(id, name) {
        const li = document.createElement('li');
        li.textContent = name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = () => deleteTodo(id, li);

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    function deleteTodo(id, liElement) {
        const authToken = localStorage.getItem('authToken');
        fetch(`https://localhost:7019/api/v1/Todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the todo');
            }
            liElement.remove();
        })
        .catch(error => {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo: ' + error.message);  
        });
    }

    // Initialize fetching todos when page loads
    fetchTodos();
});