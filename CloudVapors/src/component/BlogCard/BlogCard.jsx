import React from 'react'
import './style.css'
import BlogImg from '../../assets/blogimg.png'
import { ChevronRight } from 'lucide-react'
const BlogCard = () => {
  return (
    <div className='blog-card-container'>
        <img src={BlogImg} alt="" />
        <div className="blog-card-heading">
            <span>Migrating to Linear 101</span> 
            <ChevronRight />
        </div>
        <p>Linear helps streamline software projects, sprints, tasks, and bug Letter spacing. Here’s how to get started.</p>
    </div>
  )
}

export default BlogCard