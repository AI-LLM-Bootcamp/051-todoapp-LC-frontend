import Image from 'next/image'
import styles from '../styles/todo.module.css'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ToDo(props) {
  const { todo, onChange, onDelete } = props;
  const [poem, setPoem] = useState(null);
  const [isPoemVisible, setIsPoemVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // The following function is added for our LangChain test:
  async function generatePoem(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/write-poem/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
    if (res.ok) {
        const data = await res.json();
        setPoem(data.poem);
        setIsPoemVisible(true); // Show the poem box when a poem is generated
    }
  }

  // Function to close the poem box
  function closePoemBox() {
    setIsPoemVisible(false);
  }

  return (
    <>
      <div className={styles.toDoRow} key={todo.id}>
        <input
          className={styles.toDoCheckbox}
          name="completed"
          type="checkbox"
          checked={todo.completed}
          value={todo.completed}
          onChange={(e) => onChange(e, todo.id)}
        ></input>
        <input
          className={styles.todoInput}
          autoComplete='off'
          name="name"
          type="text"
          value={todo.name}
          onChange={(e) => onChange(e, todo.id)}
        ></input>
        <button
          className={styles.generatePoemBtn}
          onClick={() => generatePoem(todo.id)}
        >
          Generate Poem
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)}>
          <Image src="/delete-outline.svg" width="24" height="24" />
        </button>
      </div>
      {isPoemVisible && mounted && createPortal(
        <>
          <div className={styles.overlay} onClick={closePoemBox}></div>
          <div className={styles.poemBox}>
            <button className={styles.closeButton} onClick={closePoemBox}>
              &times;
            </button>
            <div className={styles.poem}>
              <p>{poem}</p>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );  

}