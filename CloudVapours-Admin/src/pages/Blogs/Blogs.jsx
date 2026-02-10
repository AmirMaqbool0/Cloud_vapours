import React, { useEffect, useState } from 'react'
import './style.css'
import Header from '../../components/Header/Header'
import { Search, Trash2, Edit } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { app } from '../../firebase'
import { collection, getDocs, doc, deleteDoc, getFirestore } from 'firebase/firestore'
import { format } from 'date-fns'

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const db = getFirestore(app)

  const Get_Blogs = async () => {
    setLoading(true)
    try {
      const collectionRef = collection(db, 'blogs')
      const result = await getDocs(collectionRef)
      const arr = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))
      setBlogs(arr)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId))
        Get_Blogs()
        alert("Blog deleted successfully!")
      } catch (error) {
        console.error("Error deleting blog:", error)
        alert("Failed to delete blog")
      }
    }
  }

  const filteredBlogs = blogs.filter(blog => 
    blog.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.detail?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    Get_Blogs()
  }, [])

  return (
    <div className='blogs-container'>
      <Header />
      <div className="blogs-content">
        <div className="blogs-header">
          <div className="blogs-header-search">
            <Search color="#b8a3e0" />
            <input 
              type="text" 
              placeholder='Search blogs...' 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <NavLink to={'/blogs/add-blog'}>
            <button>Add Blog</button>
          </NavLink>
        </div>

        {loading ? (
          <div className="loading-message">Loading blogs...</div>
        ) : filteredBlogs.length > 0 ? (
          <div className="blogs-table-container">
            <table className="blogs-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Heading</th>
                  <th>Date</th>
                  <th>Sections</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td className="blog-image-cell">
                      {blog.image && (
                        <img src={blog.image} alt={blog.heading} className="blog-image" />
                      )}
                    </td>
                    <td>
                      <div className="blog-heading">{blog.heading}</div>
                      <div className="blog-detail">{blog.detail}</div>
                    </td>
                    <td>
                      {blog.createdAt ? format(blog.createdAt, 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td>
                      {blog.subSections?.length || 0}
                    </td>
                    <td className="actions-cell">
                      {/* <NavLink to={`/blogs/edit-blog/${blog.id}`}>
                        <button className="edit-btn">
                          <Edit size={16} />
                        </button>
                      </NavLink> */}
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-blogs">
            {searchTerm ? "No matching blogs found" : "No blogs added yet"}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blogs