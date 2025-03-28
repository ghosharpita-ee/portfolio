/*
                    __     ___ _                ____          _
                    \ \   / (_) |__   ___      / ___|___   __| | ___
                     \ \ / /| | '_ \ / _ \    | |   / _ \ / _` |/ _ \
                      \ V / | | |_) |  __/    | |__| (_) | (_| |  __/
                       \_/  |_|_.__/ \___|     \____\___/ \__,_|\___|

      This Page is completely Vibe coded. No code except small tweaks is written by me.
*/


import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { tasks } from '@site/config.js';
import '../css/todo.css';
import { 
  FaClipboardList, 
  FaSyncAlt, 
  FaClock, 
  FaCheckCircle,
  FaFire,
  FaThermometerHalf,
  FaSnowflake,
  FaTasks
} from 'react-icons/fa';

function TaskList({ filterStatus }) {
  const filteredTasks = tasks.filter(task => 
    filterStatus ? task.status === filterStatus : true
  );
  
  if (filteredTasks.length === 0) {
    return (
      <div className="task-empty-state">
        <FaTasks className="task-empty-icon" />
        <p>No tasks in this category</p>
      </div>
    );
  }
  
  // Sort tasks by priority first, then by status
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Priority order: high, medium, low
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // Status order: active (in progress), pending (planned), completed
    const statusOrder = { active: 1, pending: 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
  
  return (
    <div className="task-list-container">
      <div className="task-list-table">
        <div className="task-list-header">
          <div className="task-cell task-cell-status">Status</div>
          <div className="task-cell task-cell-title">Task Details</div>
          <div className="task-cell task-cell-priority">Priority</div>
        </div>
        
        <div className="task-rows">
          {sortedTasks.map((task, index) => (
            <div 
              key={index} 
              className={`task-row ${task.status === 'completed' ? 'task-row-completed' : ''} ${index % 2 === 1 ? 'task-row-striped' : ''}`}
            >
              <div className="task-cell task-cell-status">
                <span className={`badge badge-status-${task.status}`}>
                  {task.status === 'completed' && <><FaCheckCircle className="badge-icon" /> Done</>}
                  {task.status === 'active' && <><FaSyncAlt className="badge-icon spin" /> In Progress</>}
                  {task.status === 'pending' && <><FaClock className="badge-icon" /> Planned</>}
                </span>
              </div>
              
              <div className="task-cell task-cell-title">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}
              </div>
              
              <div className="task-cell task-cell-priority">
                <span className={`badge badge-priority-${task.priority}`}>
                  {task.priority === 'high' && <><FaFire className="badge-icon" /> High</>}
                  {task.priority === 'medium' && <><FaThermometerHalf className="badge-icon" /> Medium</>}
                  {task.priority === 'low' && <><FaSnowflake className="badge-icon" /> Low</>}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function TaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'completed').length;
  const active = tasks.filter(task => task.status === 'active').length;
  const pending = tasks.filter(task => task.status === 'pending').length;
  const percentComplete = Math.round((completed / total) * 100);
  
  return (
    <div className="stats-container">
      <div className="stat-box">
        <div className="stat-label">Total Tasks</div>
        <div className="stat-value">{total}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label">Completed</div>
        <div className="stat-value stat-value-completed">{completed}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label">In Progress</div>
        <div className="stat-value stat-value-active">{active}</div>
      </div>
      <div className="stat-box">
        <div className="stat-label">Progress</div>
        <div className="stat-value">{percentComplete}%</div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{width: `${percentComplete}%`}}></div>
        </div>
      </div>
    </div>
  );
}

function TaskTabs() {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabData = [
    { id: 'all', label: 'All Tasks', icon: <FaClipboardList />, count: tasks.length },
    { id: 'active', label: 'In Progress', icon: <FaSyncAlt className="spin" />, count: tasks.filter(t => t.status === 'active').length },
    { id: 'pending', label: 'Planned', icon: <FaClock />, count: tasks.filter(t => t.status === 'pending').length },
    { id: 'completed', label: 'Completed', icon: <FaCheckCircle />, count: tasks.filter(t => t.status === 'completed').length },
  ];
  
  return (
    <div className="task-tabs-container">
      <div className="task-tabs" role="tablist" aria-label="Task categories">
        {tabData.map(tab => (
          <button 
            key={tab.id}
            className={`task-tab ${activeTab === tab.id ? 'task-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-content-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            <span className="task-tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="task-tab-label">{tab.label}</span>
            <span className="task-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>
      
      <div 
        className="task-tab-content" 
        role="tabpanel" 
        id={`tab-content-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'all' && <TaskList />}
        {activeTab === 'active' && <TaskList filterStatus="active" />}
        {activeTab === 'pending' && <TaskList filterStatus="pending" />}
        {activeTab === 'completed' && <TaskList filterStatus="completed" />}
      </div>
    </div>
  );
}


export default function TodoPage() {
  const title = "Development Roadmap";
  const description = "Track ongoing and future development tasks for this portfolio website";
  
  return (
    <Layout title={title} description={description}>
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      
      <div className="todo-container">
        <div className="todo-header">
          <h1 className="todo-heading">{title}</h1>
        </div>
        
        <div className="todo-content">
          <TaskStats />
          <TaskTabs />
        </div>
      </div>
    </Layout>
  );
}
