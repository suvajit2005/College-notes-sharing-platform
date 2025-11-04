// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// const StudentPortal = () => {
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [filters, setFilters] = useState({
//     department: '',
//     semester: '',
//     subject: ''
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Updated departments array
//   const departments = [
//     'Arts and Humanities',
//     'History',
//     'Philosophy',
//     'Sanskrit',
//     'English', 
//     'Bengali',
//     'Journalism and Mass Communication',
//     'Botany',
//     'Zoology',
//     'Chemistry',
//     'Physics',
//     'Mathematics',
//     'Computer Science',
//     'Geography',
//     'Physiology',
//     'Computer Application (BCA)',
//     'Performing Arts',
//     'Visual Arts',
//     'Postgraduate Diploma in Yoga',
//     'Travel & Tourism Management'
//   ];

//   // Updated semesters for general college (1-6)
//   const semesters = ['1', '2', '3', '4', '5', '6'];

//   // Mock data with your college departments
//   const mockNotes = [
//     {
//       _id: '1',
//       title: 'Introduction to Humanities',
//       description: 'Basic concepts and fundamentals of humanities studies with examples and exercises',
//       department: 'Arts and Humanities',
//       semester: '1',
//       subject: 'Humanities',
//       downloadCount: 145,
//       uploadDate: new Date('2024-01-15'),
//       originalName: 'intro-humanities.pdf',
//       uploadedBy: { name: 'Dr. Sharma' },
//       fileSize: '2.4 MB'
//     },
//     {
//       _id: '2',
//       title: 'Modern History Complete Guide',
//       description: 'Comprehensive notes on modern historical events and analysis',
//       department: 'History',
//       semester: '2',
//       subject: 'Modern History',
//       downloadCount: 278,
//       uploadDate: new Date('2024-02-20'),
//       originalName: 'modern-history.pdf',
//       uploadedBy: { name: 'Prof. Das' },
//       fileSize: '3.1 MB'
//     },
//     {
//       _id: '3',
//       title: 'Botany Fundamentals',
//       description: 'Introduction to plant biology and botanical principles',
//       department: 'Botany',
//       semester: '1',
//       subject: 'Plant Biology',
//       downloadCount: 89,
//       uploadDate: new Date('2024-01-30'),
//       originalName: 'botany-fundamentals.pdf',
//       uploadedBy: { name: 'Dr. Patel' },
//       fileSize: '1.8 MB'
//     },
//     {
//       _id: '4',
//       title: 'English Literature Basics',
//       description: 'Introduction to English literature principles and applications',
//       department: 'English',
//       semester: '1',
//       subject: 'English Literature',
//       downloadCount: 167,
//       uploadDate: new Date('2024-03-10'),
//       originalName: 'english-literature.pdf',
//       uploadedBy: { name: 'Prof. Brown' },
//       fileSize: '2.9 MB'
//     },
//     {
//       _id: '5',
//       title: 'Computer Science Fundamentals',
//       description: 'Basic programming and computer science principles',
//       department: 'Computer Science',
//       semester: '1',
//       subject: 'Computer Fundamentals',
//       downloadCount: 192,
//       uploadDate: new Date('2024-02-05'),
//       originalName: 'computer-fundamentals.pdf',
//       uploadedBy: { name: 'Dr. Gupta' },
//       fileSize: '4.2 MB'
//     },
//     {
//       _id: '6',
//       title: 'Chemistry Laboratory Manual',
//       description: 'Practical experiments and laboratory procedures in chemistry',
//       department: 'Chemistry',
//       semester: '2',
//       subject: 'Chemistry Lab',
//       downloadCount: 154,
//       uploadDate: new Date('2024-03-15'),
//       originalName: 'chemistry-lab.pdf',
//       uploadedBy: { name: 'Prof. Singh' },
//       fileSize: '2.1 MB'
//     }
//   ];

//   // Fetch notes
//   const fetchNotes = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Simulate API call delay
//       setTimeout(() => {
//         setNotes(mockNotes);
//         setFilteredNotes(mockNotes);
//         setLoading(false);
//       }, 1000);
//     } catch (error) {
//       console.error('Error fetching notes:', error);
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchNotes();
//   }, [fetchNotes]);

//   // Apply filters and search
//   useEffect(() => {
//     let result = notes;

//     // Apply department filter
//     if (filters.department) {
//       result = result.filter(note => 
//         note.department.toLowerCase() === filters.department.toLowerCase()
//       );
//     }

//     // Apply semester filter
//     if (filters.semester) {
//       result = result.filter(note => note.semester === filters.semester);
//     }

//     // Apply subject filter
//     if (filters.subject) {
//       result = result.filter(note =>
//         note.subject.toLowerCase().includes(filters.subject.toLowerCase())
//       );
//     }

//     // Apply search term
//     if (searchTerm) {
//       result = result.filter(note =>
//         note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         note.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredNotes(result);
//   }, [notes, filters, searchTerm]);

//   const handleDownload = async (note) => {
//     try {
//       // Mock download
//       const updatedNotes = notes.map(n => 
//         n._id === note._id ? { ...n, downloadCount: n.downloadCount + 1 } : n
//       );
//       setNotes(updatedNotes);
      
//       alert(`Downloading: ${note.title}\n\nThis is a demo. In a real application, the PDF file would start downloading.`);
      
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       alert('Error downloading file. Please try again.');
//     }
//   };

//   const clearFilters = () => {
//     setFilters({
//       department: '',
//       semester: '',
//       subject: ''
//     });
//     setSearchTerm('');
//   };

//   const getPopularityColor = (downloadCount) => {
//     if (downloadCount > 200) return '#ef4444'; // red
//     if (downloadCount > 100) return '#f59e0b'; // orange
//     if (downloadCount > 50) return '#10b981';  // green
//     return '#6b7280'; // gray
//   };

//   const getFileSizeColor = (size) => {
//     const mb = parseFloat(size);
//     if (mb > 3) return '#ef4444'; // red
//     if (mb > 2) return '#f59e0b'; // orange
//     return '#10b981'; // green
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//       padding: '2rem 1rem'
//     }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
//         {/* Header Section */}
//         <div style={{
//           background: 'linear-gradient(135deg, #10b981, #059669)',
//           color: 'white',
//           padding: '2rem',
//           borderRadius: '20px',
//           marginBottom: '2rem',
//           boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
//         }}>
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: '1rem'
//           }}>
//             <div>
//               <h1 style={{
//                 fontSize: '2.5rem',
//                 fontWeight: '700',
//                 margin: '0 0 0.5rem 0'
//               }}>
//                 Student Portal
//               </h1>
//               <p style={{
//                 fontSize: '1.1rem',
//                 opacity: 0.9,
//                 margin: 0
//               }}>
//                 Discover and download study materials from your teachers
//               </p>
//             </div>
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.2)',
//               padding: '1rem 1.5rem',
//               borderRadius: '12px',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Available Notes</div>
//               <div style={{ fontSize: '2rem', fontWeight: '700' }}>{filteredNotes.length}</div>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div style={{
//           background: 'white',
//           padding: '1.5rem',
//           borderRadius: '15px',
//           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//           marginBottom: '2rem'
//         }}>
//           <div style={{
//             display: 'flex',
//             gap: '1rem',
//             alignItems: 'center',
//             flexWrap: 'wrap'
//           }}>
//             <div style={{ flex: 1, minWidth: '300px' }}>
//               <input
//                 type="text"
//                 placeholder="Search notes by title, description, or teacher..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{
//                   width: '100%',
//                   padding: '0.875rem 1rem',
//                   border: '2px solid #e2e8f0',
//                   borderRadius: '10px',
//                   fontSize: '0.9rem',
//                   transition: 'all 0.3s ease',
//                   backgroundColor: '#fff',
//                   boxSizing: 'border-box'
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#10b981';
//                   e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e2e8f0';
//                   e.target.style.boxShadow = 'none';
//                 }}
//               />
//             </div>
//             <button
//               onClick={clearFilters}
//               style={{
//                 background: 'linear-gradient(135deg, #6b7280, #4b5563)',
//                 color: 'white',
//                 border: 'none',
//                 padding: '0.875rem 1.5rem',
//                 borderRadius: '10px',
//                 fontSize: '0.9rem',
//                 fontWeight: '600',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease',
//                 whiteSpace: 'nowrap'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.transform = 'translateY(-1px)';
//                 e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.4)';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = 'none';
//               }}
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div style={{
//           background: 'white',
//           padding: '1.5rem',
//           borderRadius: '15px',
//           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//           marginBottom: '2rem'
//         }}>
//           <h3 style={{
//             fontSize: '1.1rem',
//             fontWeight: '600',
//             color: '#1a202c',
//             marginBottom: '1rem',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.5rem'
//           }}>
//             <span>🔍</span> Filter Notes
//           </h3>
          
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '1rem'
//           }}>
//             {/* Department Filter */}
//             <div>
//               <label style={{
//                 display: 'block',
//                 fontSize: '0.85rem',
//                 fontWeight: '600',
//                 color: '#2d3748',
//                 marginBottom: '0.5rem'
//               }}>
//                 Department
//               </label>
//               <select
//                 value={filters.department}
//                 onChange={(e) => setFilters({...filters, department: e.target.value})}
//                 style={{
//                   width: '100%',
//                   padding: '0.75rem 1rem',
//                   border: '2px solid #e2e8f0',
//                   borderRadius: '8px',
//                   fontSize: '0.9rem',
//                   transition: 'all 0.3s ease',
//                   backgroundColor: '#fff',
//                   boxSizing: 'border-box',
//                   cursor: 'pointer'
//                 }}
//               >
//                 <option value="">All Departments</option>
//                 {departments.map(dept => (
//                   <option key={dept} value={dept}>{dept}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Semester Filter */}
//             <div>
//               <label style={{
//                 display: 'block',
//                 fontSize: '0.85rem',
//                 fontWeight: '600',
//                 color: '#2d3748',
//                 marginBottom: '0.5rem'
//               }}>
//                 Semester
//               </label>
//               <select
//                 value={filters.semester}
//                 onChange={(e) => setFilters({...filters, semester: e.target.value})}
//                 style={{
//                   width: '100%',
//                   padding: '0.75rem 1rem',
//                   border: '2px solid #e2e8f0',
//                   borderRadius: '8px',
//                   fontSize: '0.9rem',
//                   transition: 'all 0.3s ease',
//                   backgroundColor: '#fff',
//                   boxSizing: 'border-box',
//                   cursor: 'pointer'
//                 }}
//               >
//                 <option value="">All Semesters</option>
//                 {semesters.map(sem => (
//                   <option key={sem} value={sem}>Semester {sem}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Subject Filter */}
//             <div>
//               <label style={{
//                 display: 'block',
//                 fontSize: '0.85rem',
//                 fontWeight: '600',
//                 color: '#2d3748',
//                 marginBottom: '0.5rem'
//               }}>
//                 Subject
//               </label>
//               <input
//                 type="text"
//                 placeholder="Filter by subject..."
//                 value={filters.subject}
//                 onChange={(e) => setFilters({...filters, subject: e.target.value})}
//                 style={{
//                   width: '100%',
//                   padding: '0.75rem 1rem',
//                   border: '2px solid #e2e8f0',
//                   borderRadius: '8px',
//                   fontSize: '0.9rem',
//                   transition: 'all 0.3s ease',
//                   backgroundColor: '#fff',
//                   boxSizing: 'border-box'
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#10b981';
//                   e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e2e8f0';
//                   e.target.style.boxShadow = 'none';
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Results Count */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '1.5rem',
//           flexWrap: 'wrap',
//           gap: '1rem'
//         }}>
//           <h2 style={{
//             fontSize: '1.5rem',
//             fontWeight: '600',
//             color: '#1a202c',
//             margin: 0
//           }}>
//             Available Study Materials
//             {filteredNotes.length > 0 && (
//               <span style={{
//                 fontSize: '1rem',
//                 color: '#6b7280',
//                 marginLeft: '0.5rem'
//               }}>
//                 ({filteredNotes.length} notes found)
//               </span>
//             )}
//           </h2>
//         </div>

//         {/* Notes Grid */}
//         {loading ? (
//           <div style={{
//             background: 'white',
//             padding: '4rem 2rem',
//             borderRadius: '15px',
//             boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//             textAlign: 'center'
//           }}>
//             <div style={{
//               width: '50px',
//               height: '50px',
//               border: '3px solid #f3f4f6',
//               borderTop: '3px solid #10b981',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//               margin: '0 auto 1.5rem'
//             }}></div>
//             <h3 style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
//               Loading Study Materials...
//             </h3>
//             <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
//               Fetching the latest notes from your teachers
//             </p>
//           </div>
//         ) : filteredNotes.length === 0 ? (
//           <div style={{
//             background: 'white',
//             padding: '4rem 2rem',
//             borderRadius: '15px',
//             boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//             textAlign: 'center'
//           }}>
//             <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
//             <h3 style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
//               {notes.length === 0 ? 'No Study Materials Available' : 'No Notes Found'}
//             </h3>
//             <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
//               {notes.length === 0 
//                 ? 'Study materials will appear here once teachers start uploading notes.' 
//                 : 'Try adjusting your filters or search term.'
//               }
//             </p>
//             {notes.length > 0 && (
//               <button
//                 onClick={clearFilters}
//                 style={{
//                   background: 'linear-gradient(135deg, #10b981, #059669)',
//                   color: 'white',
//                   border: 'none',
//                   padding: '0.75rem 1.5rem',
//                   borderRadius: '8px',
//                   fontSize: '0.9rem',
//                   fontWeight: '600',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
//             gap: '1.5rem'
//           }}>
//             {filteredNotes.map(note => (
//               <div
//                 key={note._id}
//                 style={{
//                   background: 'white',
//                   padding: '1.5rem',
//                   borderRadius: '15px',
//                   boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//                   transition: 'all 0.3s ease',
//                   border: '2px solid transparent',
//                   position: 'relative'
//                 }}
//                 onMouseOver={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-5px)';
//                   e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
//                   e.currentTarget.style.borderColor = '#10b981';
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
//                   e.currentTarget.style.borderColor = 'transparent';
//                 }}
//               >
//                 {/* Popularity Indicator */}
//                 <div style={{
//                   position: 'absolute',
//                   top: '1rem',
//                   right: '1rem',
//                   width: '12px',
//                   height: '12px',
//                   borderRadius: '50%',
//                   background: getPopularityColor(note.downloadCount || 0)
//                 }}></div>

//                 {/* Note Header */}
//                 <div style={{ marginBottom: '1rem' }}>
//                   <h3 style={{
//                     fontSize: '1.2rem',
//                     fontWeight: '600',
//                     color: '#1a202c',
//                     margin: '0 0 0.5rem 0',
//                     lineHeight: '1.4'
//                   }}>
//                     {note.title}
//                   </h3>
//                   {note.description && (
//                     <p style={{
//                       color: '#6b7280',
//                       fontSize: '0.9rem',
//                       margin: '0 0 1rem 0',
//                       lineHeight: '1.5'
//                     }}>
//                       {note.description}
//                     </p>
//                   )}
//                 </div>

//                 {/* Note Meta Info */}
//                 <div style={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   gap: '0.5rem',
//                   marginBottom: '1rem'
//                 }}>
//                   <span style={{
//                     background: '#4361ee',
//                     color: 'white',
//                     padding: '0.25rem 0.75rem',
//                     borderRadius: '20px',
//                     fontSize: '0.8rem',
//                     fontWeight: '500'
//                   }}>
//                     {note.department}
//                   </span>
//                   <span style={{
//                     background: '#10b981',
//                     color: 'white',
//                     padding: '0.25rem 0.75rem',
//                     borderRadius: '20px',
//                     fontSize: '0.8rem',
//                     fontWeight: '500'
//                   }}>
//                     Sem {note.semester}
//                   </span>
//                   <span style={{
//                     background: '#f59e0b',
//                     color: 'white',
//                     padding: '0.25rem 0.75rem',
//                     borderRadius: '20px',
//                     fontSize: '0.8rem',
//                     fontWeight: '500'
//                   }}>
//                     {note.subject}
//                   </span>
//                 </div>

//                 {/* Note Details */}
//                 <div style={{
//                   display: 'grid',
//                   gridTemplateColumns: '1fr 1fr',
//                   gap: '1rem',
//                   marginBottom: '1.5rem',
//                   fontSize: '0.8rem',
//                   color: '#6b7280'
//                 }}>
//                   <div>
//                     <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>👨‍🏫 Teacher</div>
//                     <div>{note.uploadedBy?.name || 'Unknown'}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>📊 Downloads</div>
//                     <div>{(note.downloadCount || 0).toLocaleString()}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>📅 Uploaded</div>
//                     <div>{new Date(note.uploadDate).toLocaleDateString()}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>💾 Size</div>
//                     <div style={{ color: getFileSizeColor(note.fileSize) }}>
//                       {note.fileSize}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Download Button */}
//                 <button
//                   onClick={() => handleDownload(note)}
//                   style={{
//                     width: '100%',
//                     background: 'linear-gradient(135deg, #10b981, #059669)',
//                     color: 'white',
//                     border: 'none',
//                     padding: '0.875rem 1.5rem',
//                     borderRadius: '10px',
//                     fontSize: '0.9rem',
//                     fontWeight: '600',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '0.5rem'
//                   }}
//                   onMouseOver={(e) => {
//                     e.target.style.transform = 'translateY(-2px)';
//                     e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 >
//                   <span>📥</span>
//                   Download PDF
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add CSS animation for spinner */}
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default StudentPortal;
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentPortal = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    subject: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);

  // Departments array (same as your backend)
  const departments = [
    'Arts and Humanities',
    'History',
    'Philosophy',
    'Sanskrit',
    'English', 
    'Bengali',
    'Journalism and Mass Communication',
    'Botany',
    'Zoology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Computer Science',
    'Geography',
    'Physiology',
    'Computer Application (BCA)',
    'Performing Arts',
    'Visual Arts',
    'Postgraduate Diploma in Yoga',
    'Travel & Tourism Management'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6'];

  // Fetch real notes from backend
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://college-notes-sharing-platform-backend.onrender.com/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setNotes(data.notes || []);
        setFilteredNotes(data.notes || []);
      } else {
        setError(data.message || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Apply filters and search
  useEffect(() => {
    let result = notes;

    // Apply department filter
    if (filters.department) {
      result = result.filter(note => 
        note.department.toLowerCase() === filters.department.toLowerCase()
      );
    }

    // Apply semester filter
    if (filters.semester) {
      result = result.filter(note => note.semester === filters.semester);
    }

    // Apply subject filter
    if (filters.subject) {
      result = result.filter(note =>
        note.subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }

    // Apply search term
    if (searchTerm) {
      result = result.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.description && note.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.uploadedBy && note.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredNotes(result);
  }, [notes, filters, searchTerm]);

  // Download note with better tracking
  const handleDownload = async (note) => {
    try {
      setDownloading(note._id);
      const token = localStorage.getItem('token');
      
      const downloadResponse = await fetch(`https://college-notes-sharing-platform-backend.onrender.com/api/notes/${note._id}/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const downloadData = await downloadResponse.json();

      if (downloadResponse.ok && downloadData.success) {
        // Download the file
        const downloadUrl = `https://college-notes-sharing-platform-backend.onrender.com${note.filePath}`;
        window.open(downloadUrl, '_blank');
        
        // Refresh notes to update download count
        setTimeout(() => {
          fetchNotes();
        }, 1000);

        // Trigger event to refresh download history on MyDownloads page
        localStorage.setItem('downloadTrigger', Date.now().toString());
        
      } else {
        alert(`Download error: ${downloadData.message || 'Failed to prepare download'}`);
      }
      
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setDownloading(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      semester: '',
      subject: ''
    });
    setSearchTerm('');
  };

  const getPopularityColor = (downloadCount) => {
    if (downloadCount > 200) return '#ef4444';
    if (downloadCount > 100) return '#f59e0b';
    if (downloadCount > 50) return '#10b981';
    return '#6b7280';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Computer Science': '#4361ee',
      'Mathematics': '#3a0ca3',
      'Physics': '#7209b7',
      'Chemistry': '#f72585',
      'English': '#4895ef',
      'History': '#4cc9f0',
      'Botany': '#2ec4b6',
      'Zoology': '#e71d36',
      'Arts and Humanities': '#ff9e00',
      'Philosophy': '#8338ec',
      'default': '#6b7280'
    };
    return colors[department] || colors.default;
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Header Section */}
        <div className="portal-header">
          <div className="header-content">
            <div>
              <h1 className="portal-title">🎓 Student Portal</h1>
              <p className="portal-subtitle">
                Access study materials uploaded by your teachers
              </p>
            </div>
            <div className="notes-counter">
              <div className="counter-label">Available Notes</div>
              <div className="counter-number">{notes.length}</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div className="error-text">{error}</div>
            <button 
              onClick={fetchNotes}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search and Filters Section */}
        <div className="search-filters-section">
          {/* Search Bar - Updated to match BrowseNotes */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search notes by title, description, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <h3 className="filters-title">
              🔍 Filter Notes
            </h3>
            
            <div className="filters-grid">
              {/* Department Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="filter-select"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  Semester
                </label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters({...filters, semester: e.target.value})}
                  className="filter-select"
                >
                  <option value="">All Semesters</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Filter by subject..."
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="filter-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-header">
          <h2 className="results-title">
            📚 Study Materials
            {filteredNotes.length > 0 && (
              <span className="results-count">
                ({filteredNotes.length} notes found)
              </span>
            )}
          </h2>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Loading Study Materials...</h3>
            <p className="loading-subtitle">
              Fetching notes from the server
            </p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">
              {notes.length === 0 ? 'No Study Materials Available' : 'No Notes Found'}
            </h3>
            <p className="empty-subtitle">
              {notes.length === 0 
                ? 'Teachers haven\'t uploaded any notes yet. Check back later!' 
                : 'Try adjusting your filters or search term.'
              }
            </p>
            {notes.length === 0 && (
              <button
                onClick={fetchNotes}
                className="refresh-btn"
              >
                Refresh
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => (
              <div
                key={note._id}
                className="note-card"
              >
                {/* Popularity Indicator */}
                <div 
                  className="popularity-indicator"
                  style={{ background: getPopularityColor(note.downloadCount || 0) }}
                ></div>

                {/* Note Header */}
                <div className="note-header">
                  <h3 className="note-title">
                    {note.title}
                  </h3>
                  {note.description && (
                    <p className="note-description">
                      {note.description}
                    </p>
                  )}
                </div>

                {/* Note Meta Info */}
                <div className="note-tags">
                  <span 
                    className="tag department-tag"
                    style={{ 
                      background: getDepartmentColor(note.department)
                    }}
                  >
                    {note.department}
                  </span>
                  <span className="tag semester-tag">
                    Sem {note.semester}
                  </span>
                  <span className="tag subject-tag">
                    {note.subject}
                  </span>
                </div>

                {/* Note Details */}
                <div className="note-details">
                  <div className="detail-item">
                    <div className="detail-label">👨‍🏫 Teacher</div>
                    <div className="detail-value">{note.uploadedBy?.name || 'Unknown'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">📊 Downloads</div>
                    <div className="detail-value">{(note.downloadCount || 0).toLocaleString()}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">📅 Uploaded</div>
                    <div className="detail-value">{formatDate(note.createdAt)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">💾 Size</div>
                    <div className="detail-value">{formatFileSize(note.fileSize)}</div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(note)}
                  disabled={downloading === note._id}
                  className={`download-btn ${downloading === note._id ? 'downloading' : ''}`}
                >
                  {downloading === note._id ? (
                    <>
                      <span className="download-spinner"></span>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <span>📥</span>
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header Styles */
        .portal-header {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .portal-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .portal-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        .notes-counter {
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          text-align: center;
        }

        .counter-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .counter-number {
          font-size: 2rem;
          font-weight: 700;
        }

        /* Error Message */
        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .error-text {
          flex: 1;
        }

        .retry-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
        }

        /* Search and Filters - Updated to match BrowseNotes */
        .search-filters-section {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .search-section {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 250px;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: #fff;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .clear-filters-btn {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .clear-filters-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
        }

        .filters-section {
          padding: 1.5rem;
        }

        .filters-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .filter-select,
        .filter-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: #fff;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        /* Results Header */
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .results-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .results-count {
          font-size: 1rem;
          color: #6b7280;
          font-weight: normal;
        }

        /* Loading State */
        .loading-state {
          background: white;
          padding: 4rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        .loading-title {
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .loading-subtitle {
          color: #6b7280;
          font-size: 0.9rem;
        }

        /* Empty State */
        .empty-state {
          background: white;
          padding: 4rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .refresh-btn {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        /* Notes Grid */
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .note-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .note-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: #8b5cf6;
        }

        .popularity-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .note-header {
          margin-bottom: 1rem;
          flex: 1;
        }

        .note-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .note-description {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .note-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          color: white;
          white-space: nowrap;
        }

        .semester-tag {
          background: #10b981;
        }

        .subject-tag {
          background: #f59e0b;
        }

        .note-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          font-weight: 500;
          word-break: break-word;
        }

        .download-btn {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: auto;
        }

        .download-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .download-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .download-btn.downloading {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .download-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .portal-title {
            font-size: 2rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .notes-grid {
            grid-template-columns: 1fr;
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            min-width: auto;
            width: 100%;
          }

          .clear-filters-btn {
            width: 100%;
            text-align: center;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .results-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 0.5rem;
          }

          .portal-header {
            padding: 1.5rem;
          }

          .search-filters-section {
            margin: 0 -0.5rem 2rem;
            border-radius: 0;
          }

          .notes-grid {
            grid-template-columns: 1fr;
          }

          .note-card {
            padding: 1rem;
          }

          .note-details {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};


export default StudentPortal;
