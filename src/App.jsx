import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostLoading, setNewPostLoading] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [updatePostLoading, setUpdatePostLoading] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json();
      setPosts(data);
      setIsLoading(false);
    };
    getPosts();
  }, [refetch]);

  const handleSubmit = async e => {
    e.preventDefault();
    setNewPostLoading(true);
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: nanoid(),
        title: newPostTitle,
        body: newPostBody,
        userId: 1,
      }),
    });
    if (res.ok) {
      setNewPostTitle('');
      setNewPostBody('');
      alert('New Post Added');
      setRefetch(prev => !prev);
    } else alert('Failed To Add New Post');
    setNewPostLoading(false);
  };

  const handleDelete = async postId => {
    setDeletePostLoading(true);
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      alert('Post Deleted');
      setRefetch(prev => !prev);
    } else alert('Failed To Delete Post');
    setDeletePostLoading(false);
  };

  const handleUpdate = async postId => {
    setUpdatePostLoading(true);
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newPostTitle,
        body: newPostBody,
      }),
    });
    if (res.ok) {
      setNewPostTitle('');
      setNewPostBody('');
      alert('Post Updated');
      setRefetch(prev => !prev);
    } else alert('Failed To Update Post');
    setUpdatePostLoading(false);
  };

  if (isLoading) return <pre>Loading...</pre>;

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={newPostTitle}
          onChange={e => setNewPostTitle(e.target.value)}
          placeholder='New Post Title...'
        />
        <textarea value={newPostBody} onChange={e => setNewPostBody(e.target.value)} placeholder='New Post Body...' />
        <button disabled={newPostLoading}>Submit</button>
      </form>
      <h1>Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <button onClick={() => handleDelete(post.id)} disabled={deletePostLoading}>
            Delete
          </button>
          <button onClick={() => handleUpdate(post.id)} disabled={updatePostLoading}>
            Update
          </button>
        </article>
      ))}
    </main>
  );
}
