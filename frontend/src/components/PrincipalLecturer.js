import React, { useState } from 'react';

const PrincipalLecturer = ({ onLogout, setCurrentView, setProgramLeaderReports }) => {
  const [activeTab, setActiveTab] = useState('monitoring');
  
  // State for each tab's form data
  const [monitoringData, setMonitoringData] = useState({
    observation: '',
    recommendations: ''
  });
  
  const [reportsData, setReportsData] = useState({
    reportType: '',
    findings: '',
    recommendations: ''
  });
  
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    program: '',
    course: '',
    feedback: '',
    rating: '',
    sendTo: 'lecturer'
  });
  
  const [groupReportsData, setGroupReportsData] = useState({
    reportGroupName: '',
    selectedReports: [],
    summary: '',
    priority: 'medium'
  });
  
  const [coursesData, setCoursesData] = useState({
    courseTitle: '',
    description: '',
    objectives: '',
    requirements: ''
  });

  // State for storing generated reports
  const [generatedReports, setGeneratedReports] = useState([]);
  const [groupedReports, setGroupedReports] = useState([]);
  const [sentReports, setSentReports] = useState([]);
  
  // State for course proposals
  const [courseProposals, setCourseProposals] = useState([]);

  // Available programs for student selection
  const availablePrograms = [
    'Information Technology (IT)',
    'Business Information Technology (BIT)',
    'Software Engineering',
    
  ];

  // Available course titles for dropdown
  const availableCourseTitles = [
    'Introduction to Programming',
    'Database Management Systems',
    'Web Development Fundamentals',
    'Object-Oriented Programming',
    'Data Structures and Algorithms',
    'Software Engineering Principles',
    'Network Security',
    'Cloud Computing',
    'Mobile Application Development',
    'Artificial Intelligence Fundamentals',
    'Machine Learning Basics',
    'Big Data Analytics',
    'Cyber Security Essentials',
    'IT Project Management',
    'Human-Computer Interaction',
    'Operating Systems',
    'Computer Networks',
    'Database Design and Implementation',
    'Web Application Development',
    'Software Testing and Quality Assurance'
  ];

  const handleSubmit = (tabName, data) => {
    let submissionMessage = `${tabName.charAt(0).toUpperCase() + tabName.slice(1)} submitted successfully!\n\n`;
    
    if (tabName === 'feedback') {
      const recipientType = data.sendTo === 'lecturer' ? 'Lecturer' : 'Student';
      submissionMessage += `Sent to: ${recipientType} Portal\n`;
      submissionMessage += `${recipientType} Name: ${data.name}\n`;
      if (data.sendTo === 'student') {
        submissionMessage += `Program: ${data.program}\n`;
      }
      submissionMessage += `Course: ${data.course}\n`;
      submissionMessage += `Rating: ${data.rating}\n`;
      submissionMessage += `\nFeedback Details:\n${data.feedback}`;
    } else {
      submissionMessage += `Details have been processed and stored in the system.`;
    }
    
    alert(submissionMessage);
    
    switch(tabName) {
      case 'monitoring':
        setMonitoringData({ observation: '', recommendations: '' });
        break;
      case 'reports':
        setReportsData({ reportType: '', findings: '', recommendations: '' });
        const newReport = {
          id: Date.now(),
          type: data.reportType,
          title: `${data.reportType.charAt(0).toUpperCase() + data.reportType.slice(1)} Report`,
          date: new Date().toLocaleDateString(),
          status: 'generated',
          data: data,
          sentToProgramLeader: false
        };
        setGeneratedReports(prev => [newReport, ...prev]);
        break;
      case 'feedback':
        setFeedbackData({ name: '', program: '', course: '', feedback: '', rating: '', sendTo: 'lecturer' });
        break;
      case 'groupReports':
        setGroupReportsData({ 
          reportGroupName: '', 
          selectedReports: [], 
          summary: '', 
          priority: 'medium' 
        });
        break;
      case 'courses':
        const newCourseProposal = {
          id: Date.now(),
          title: data.courseTitle,
          description: data.description,
          objectives: data.objectives,
          requirements: data.requirements,
          date: new Date().toLocaleDateString(),
          status: 'pending',
          submittedBy: 'Principal Lecturer'
        };
        setCourseProposals(prev => [newCourseProposal, ...prev]);
        setCoursesData({ courseTitle: '', description: '', objectives: '', requirements: '' });
        
        // Send course proposal to Program Leader
        if (setProgramLeaderReports) {
          const principalReport = {
            id: Date.now(),
            title: 'Course Proposal Review',
            priority: 'medium',
            from: 'Principal Lecturer',
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subject: `New Course Proposal: ${data.courseTitle}`,
            keyPoints: [
              `Course Title: ${data.courseTitle}`,
              `Description: ${data.description.substring(0, 100)}...`,
              `Learning Objectives: ${data.objectives.substring(0, 100)}...`
            ],
            actionRequired: 'Please review this course proposal and provide feedback on its alignment with program objectives and resource requirements.',
            response: '',
            status: 'pending',
            responseDate: ''
          };
          setProgramLeaderReports(prev => [...prev, principalReport]);
        }
        
        alert(`Course proposal "${data.courseTitle}" submitted successfully!\n\nThis proposal has been sent to the Program Leader for review and approval.`);
        break;
      default:
        break;
    }
  };

  // Handle report selection for grouping
  const handleReportSelection = (reportId) => {
    setGroupReportsData(prev => {
      const isSelected = prev.selectedReports.includes(reportId);
      return {
        ...prev,
        selectedReports: isSelected 
          ? prev.selectedReports.filter(id => id !== reportId)
          : [...prev.selectedReports, reportId]
      };
    });
  };

  // Handle group reports submission
  const handleGroupReportsSubmit = (e) => {
    e.preventDefault();
    
    if (groupReportsData.selectedReports.length === 0) {
      alert('Please select at least one report to group.');
      return;
    }

    if (!groupReportsData.reportGroupName.trim()) {
      alert('Please provide a name for the report group.');
      return;
    }

    const selectedReportDetails = generatedReports.filter(report => 
      groupReportsData.selectedReports.includes(report.id)
    );

    const newGroupedReport = {
      id: Date.now(),
      name: groupReportsData.reportGroupName,
      reports: selectedReportDetails,
      summary: groupReportsData.summary,
      priority: groupReportsData.priority,
      date: new Date().toLocaleDateString(),
      status: 'grouped',
      sentToProgramLeader: false
    };

    setGroupedReports(prev => [newGroupedReport, ...prev]);
    
    alert(`Reports grouped successfully!\n\nGroup Name: ${groupReportsData.reportGroupName}\nNumber of Reports: ${selectedReportDetails.length}\n\nReports have been prepared for sending to Program Leader.`);
    
    setGroupReportsData({ 
      reportGroupName: '', 
      selectedReports: [], 
      summary: '', 
      priority: 'medium' 
    });
  };

  // Send individual report to Program Leader
  const sendIndividualReport = (reportId) => {
    const report = generatedReports.find(r => r.id === reportId);
    
    setGeneratedReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, sentToProgramLeader: true, sentDate: new Date().toLocaleDateString() }
          : report
      )
    );
    
    setSentReports(prev => [...prev, { ...report, sentIndividually: true }]);
    
    // Send to Program Leader
    if (setProgramLeaderReports) {
      const principalReport = {
        id: Date.now(),
        title: `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Analysis Report`,
        priority: report.data.priority || 'medium',
        from: 'Principal Lecturer',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subject: `${report.type} Analysis - ${report.date}`,
        keyConcerns: [
          `Report Type: ${report.type}`,
          `Key Findings: ${report.data.findings.substring(0, 150)}...`,
          `Recommendations: ${report.data.recommendations.substring(0, 150)}...`
        ],
        actionRequired: 'Please review this report and provide your response addressing the findings and recommendations.',
        response: '',
        status: 'pending',
        responseDate: ''
      };
      setProgramLeaderReports(prev => [...prev, principalReport]);
    }
    
    alert(`Report "${report.title}" has been sent to the Program Leader successfully!\n\nType: ${report.type}\nDate: ${report.date}`);
  };

  // Send grouped reports to Program Leader
  const sendGroupedReport = (groupId) => {
    const group = groupedReports.find(g => g.id === groupId);
    
    setGroupedReports(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, sentToProgramLeader: true, sentDate: new Date().toLocaleDateString() }
          : group
      )
    );
    
    const reportIdsInGroup = group.reports.map(r => r.id);
    setGeneratedReports(prev => 
      prev.map(report => 
        reportIdsInGroup.includes(report.id)
          ? { ...report, sentToProgramLeader: true, sentDate: new Date().toLocaleDateString() }
          : report
      )
    );
    
    setSentReports(prev => [...prev, { ...group, sentAsGroup: true }]);
    
    // Send to Program Leader
    if (setProgramLeaderReports) {
      const principalReport = {
        id: Date.now(),
        title: `Report Group: ${group.name}`,
        priority: group.priority,
        from: 'Principal Lecturer',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subject: `Compiled Reports Analysis - ${group.date}`,
        keyPoints: [
          `Group Summary: ${group.summary}`,
          `Number of Reports: ${group.reports.length}`,
          `Reports Included: ${group.reports.map(r => r.type).join(', ')}`
        ],
        actionRequired: 'Please review this compiled report group and provide your comprehensive response addressing all findings.',
        response: '',
        status: 'pending',
        responseDate: ''
      };
      setProgramLeaderReports(prev => [...prev, principalReport]);
    }
    
    alert(`Report group "${group.name}" has been sent to the Program Leader successfully!\n\nNumber of reports: ${group.reports.length}\nPriority: ${group.priority}`);
  };

  // Delete a generated report
  const deleteGeneratedReport = (reportId) => {
    setGeneratedReports(prev => prev.filter(report => report.id !== reportId));
    alert('Report deleted successfully!');
  };

  // Delete a grouped report
  const deleteGroupedReport = (groupId) => {
    setGroupedReports(prev => prev.filter(group => group.id !== groupId));
    alert('Report group deleted successfully!');
  };

  // Delete a course proposal
  const deleteCourseProposal = (proposalId) => {
    setCourseProposals(prev => prev.filter(proposal => proposal.id !== proposalId));
    alert('Course proposal deleted successfully!');
  };

  return (
    <div className="principal-lecturer-portal">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="nav-header">
          <h2>Principal Lecturer Portal</h2>
          <div className="user-info">
            <span>Welcome, Principal Lecturer</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <nav className="top-nav-menu">
          {['monitoring', 'reports', 'feedback', 'groupReports', 'courses'].map(tab => (
            <button
              key={tab}
              className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-body">
          <div className="section-header">
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}</h1>
            <p>Manage academic oversight and reporting functions</p>
          </div>
          
          {activeTab === 'monitoring' && (
            <div className="tab-content">
              <div className="form-container">
                <h3>Lecture Monitoring & Observation</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('monitoring', monitoringData); }}>
                  <div className="form-group">
                    <label>Class Observation Notes:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={monitoringData.observation}
                      onChange={(e) => setMonitoringData({...monitoringData, observation: e.target.value})}
                      placeholder="Record your observations about the lecture, teaching methods, student engagement, etc."
                      rows="6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Recommendations & Feedback:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={monitoringData.recommendations}
                      onChange={(e) => setMonitoringData({...monitoringData, recommendations: e.target.value})}
                      placeholder="Provide recommendations for improvement and positive feedback"
                      rows="4"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Submit Monitoring Report
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="tab-content">
              <div className="form-container">
                <h3>Academic Reports & Analysis</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('reports', reportsData); }}>
                  <div className="form-group">
                    <label>Report Type:</label>
                    <select 
                      className="form-control"
                      value={reportsData.reportType}
                      onChange={(e) => setReportsData({...reportsData, reportType: e.target.value})}
                      required
                    >
                      <option value="">Select Report Type</option>
                      <option value="attendance">Attendance Report</option>
                      <option value="performance">Performance Report</option>
                      <option value="lecturer">Lecturer Evaluation</option>
                      <option value="course">Course Analysis</option>
                      <option value="facility">Facility Usage</option>
                      <option value="assessment">Assessment Results</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Key Findings & Analysis:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={reportsData.findings}
                      onChange={(e) => setReportsData({...reportsData, findings: e.target.value})}
                      placeholder="Detail your findings, data analysis, and observations"
                      rows="6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Recommendations & Action Plan:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={reportsData.recommendations}
                      onChange={(e) => setReportsData({...reportsData, recommendations: e.target.value})}
                      placeholder="Provide strategic recommendations and action items"
                      rows="4"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Generate Report
                  </button>
                </form>

                {/* Generated Reports List */}
                {generatedReports.length > 0 && (
                  <div className="generated-reports-section">
                    <h4>Recently Generated Reports</h4>
                    <p className="section-description">These reports are now available in the "Group Reports" section for compilation and sending to the Program Leader.</p>
                    <div className="reports-grid">
                      {generatedReports.slice(0, 3).map(report => (
                        <div key={report.id} className="report-card">
                          <div className="report-header">
                            <strong>{report.title}</strong>
                            <span className={`status-badge ${report.sentToProgramLeader ? 'sent' : 'generated'}`}>
                              {report.sentToProgramLeader ? 'Sent' : 'Generated'}
                            </span>
                          </div>
                          <div className="report-details">
                            <p><strong>Type:</strong> {report.type}</p>
                            <p><strong>Date:</strong> {report.date}</p>
                            <p><strong>Findings:</strong> {report.data.findings.substring(0, 100)}...</p>
                          </div>
                          {report.sentToProgramLeader && (
                            <div className="report-sent-info">
                              ✓ Sent on {report.sentDate}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {generatedReports.length > 3 && (
                      <div className="view-all-notice">
                        <p>+ {generatedReports.length - 3} more reports available in Group Reports section</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="tab-content">
              <div className="form-container">
                <h3>Performance Feedback</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('feedback', feedbackData); }}>
                  <div className="form-group">
                    <label>Send Feedback To:</label>
                    <select 
                      className="form-control"
                      value={feedbackData.sendTo}
                      onChange={(e) => setFeedbackData({...feedbackData, sendTo: e.target.value})}
                      required
                    >
                      <option value="lecturer">Lecturer Portal</option>
                      <option value="student">Student Portal</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        {feedbackData.sendTo === 'lecturer' ? 'Lecturer Name:' : 'Student Name:'}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={feedbackData.name}
                        onChange={(e) => setFeedbackData({...feedbackData, name: e.target.value})}
                        placeholder={feedbackData.sendTo === 'lecturer' ? "Enter lecturer's name" : "Enter student's name"}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Course/Module:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={feedbackData.course}
                        onChange={(e) => setFeedbackData({...feedbackData, course: e.target.value})}
                        placeholder="Enter course name"
                        required
                      />
                    </div>
                  </div>

                  {feedbackData.sendTo === 'student' && (
                    <div className="form-group">
                      <label>Student Program:</label>
                      <select 
                        className="form-control"
                        value={feedbackData.program}
                        onChange={(e) => setFeedbackData({...feedbackData, program: e.target.value})}
                        required
                      >
                        <option value="">Select Program</option>
                        {availablePrograms.map(program => (
                          <option key={program} value={program}>{program}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Performance Rating:</label>
                    <select 
                      className="form-control"
                      value={feedbackData.rating}
                      onChange={(e) => setFeedbackData({...feedbackData, rating: e.target.value})}
                      required
                    >
                      <option value="">Select Rating</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="satisfactory">Satisfactory</option>
                      <option value="needs-improvement">Needs Improvement</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Detailed Feedback:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={feedbackData.feedback}
                      onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
                      placeholder={
                        feedbackData.sendTo === 'lecturer' 
                          ? "Provide detailed feedback on teaching methods, communication, student engagement, etc."
                          : "Provide detailed feedback on academic performance, participation, areas for improvement, etc."
                      }
                      rows="6"
                      required
                    />
                  </div>

                  <div className="feedback-notice">
                    <div className="notice-icon"></div>
                    <div className="notice-content">
                      <strong>Feedback Destination:</strong> This feedback will be sent to the{' '}
                      <span className="portal-highlight">
                        {feedbackData.sendTo === 'lecturer' ? 'Lecturer Portal' : 'Student Portal'}
                      </span>
                      {feedbackData.sendTo === 'lecturer' 
                        ? ' for professional development and performance improvement.'
                        : ' for student awareness and academic guidance.'
                      }
                      {feedbackData.sendTo === 'student' && feedbackData.program && (
                        <div className="student-program-info">
                          <strong>Student Program:</strong> {feedbackData.program}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Submit Feedback to {feedbackData.sendTo === 'lecturer' ? 'Lecturer' : 'Student'} Portal
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'groupReports' && (
            <div className="tab-content">
              <div className="form-container">
                <h3>Compile Reports & Send to Program Leader</h3>
                <p className="section-description">Manage and send individual reports or compile them into groups for the Program Leader.</p>
                
                {/* Individual Reports Section */}
                {generatedReports.length > 0 && (
                  <div className="individual-reports-section">
                    <h4>Individual Reports Available</h4>
                    <div className="reports-selection-grid">
                      {generatedReports.map(report => (
                        <div key={report.id} className="report-selection-item">
                          <div className="report-header">
                            <div className="report-info">
                              <strong>{report.title}</strong>
                              <span className="report-date">{report.date}</span>
                              <span className={`report-status ${report.sentToProgramLeader ? 'sent' : 'available'}`}>
                                {report.sentToProgramLeader ? '✓ Sent' : 'Available'}
                              </span>
                            </div>
                            <div className="report-actions">
                              {!report.sentToProgramLeader ? (
                                <>
                                  <button 
                                    className="send-individual-btn"
                                    onClick={() => sendIndividualReport(report.id)}
                                  >
                                    Send Individual
                                  </button>
                                  <button 
                                    className="delete-btn"
                                    onClick={() => deleteGeneratedReport(report.id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <span className="sent-indicator">
                                  Sent on {report.sentDate}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="report-preview">
                            <p><strong>Type:</strong> {report.type}</p>
                            <p><strong>Findings:</strong> {report.data.findings.substring(0, 80)}...</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Group Reports Form */}
                <div className="group-reports-section">
                  <h4>Compile Reports into Groups</h4>
                  <form onSubmit={handleGroupReportsSubmit}>
                    <div className="form-group">
                      <label>Report Group Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={groupReportsData.reportGroupName}
                        onChange={(e) => setGroupReportsData({...groupReportsData, reportGroupName: e.target.value})}
                        placeholder="Enter a descriptive name for this report group"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Select Reports to Group (Available Reports Only):</label>
                      {generatedReports.filter(report => !report.sentToProgramLeader).length > 0 ? (
                        <div className="reports-selection-grid">
                          {generatedReports.filter(report => !report.sentToProgramLeader).map(report => (
                            <div key={report.id} className="report-selection-item">
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={groupReportsData.selectedReports.includes(report.id)}
                                  onChange={() => handleReportSelection(report.id)}
                                  className="checkbox-input"
                                  disabled={report.sentToProgramLeader}
                                />
                                <span className="checkmark"></span>
                                <div className="report-info">
                                  <strong>{report.title}</strong>
                                  <span className="report-date">{report.date}</span>
                                  <span className={`report-status ${report.type}`}>
                                    {report.type}
                                  </span>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-reports-message">
                          <p>No available reports to group. All reports have been sent or no reports generated yet.</p>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Priority Level:</label>
                      <select 
                        className="form-control"
                        value={groupReportsData.priority}
                        onChange={(e) => setGroupReportsData({...groupReportsData, priority: e.target.value})}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Executive Summary:</label>
                      <textarea 
                        className="form-control large-textarea"
                        value={groupReportsData.summary}
                        onChange={(e) => setGroupReportsData({...groupReportsData, summary: e.target.value})}
                        placeholder="Provide an overall summary and key insights from the grouped reports..."
                        rows="4"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={groupReportsData.selectedReports.length === 0}
                    >
                      Create Report Group ({groupReportsData.selectedReports.length} reports selected)
                    </button>
                  </form>
                </div>

                {/* Grouped Reports List */}
                {groupedReports.length > 0 && (
                  <div className="grouped-reports-section">
                    <h4>Compiled Report Groups</h4>
                    <div className="grouped-reports-list">
                      {groupedReports.map(group => (
                        <div key={group.id} className="grouped-report-card">
                          <div className="group-header">
                            <div className="group-info">
                              <h5>{group.name}</h5>
                              <div className="group-meta">
                                <span className={`priority-badge ${group.priority}`}>
                                  {group.priority} priority
                                </span>
                                <span className="report-count">
                                  {group.reports.length} reports
                                </span>
                                <span className="group-date">
                                  Created: {group.date}
                                </span>
                              </div>
                            </div>
                            <div className="group-actions">
                              {!group.sentToProgramLeader ? (
                                <button 
                                  className="send-group-btn"
                                  onClick={() => sendGroupedReport(group.id)}
                                >
                                  Send Group to Program Leader
                                </button>
                              ) : (
                                <span className="sent-badge">
                                  ✓ Group Sent on {group.sentDate}
                                </span>
                              )}
                              <button 
                                className="delete-btn"
                                onClick={() => deleteGroupedReport(group.id)}
                              >
                                Delete Group
                              </button>
                            </div>
                          </div>
                          
                          {group.summary && (
                            <div className="group-summary">
                              <strong>Summary:</strong> {group.summary}
                            </div>
                          )}
                          
                          <div className="included-reports">
                            <strong>Included Reports:</strong>
                            <div className="reports-list">
                              {group.reports.map(report => (
                                <div key={report.id} className="included-report">
                                  <span className="report-title">{report.title}</span>
                                  <span className="report-date">({report.date})</span>
                                  {report.sentToProgramLeader && (
                                    <span className="individual-sent-indicator">✓ Sent</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sent Reports Summary */}
                {sentReports.length > 0 && (
                  <div className="sent-reports-summary">
                    <h4>Sent Reports Summary</h4>
                    <div className="summary-stats">
                      <div className="stat-item">
                        <span className="stat-number">{sentReports.length}</span>
                        <span className="stat-label">Total Reports Sent</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">
                          {sentReports.filter(r => r.sentIndividually).length}
                        </span>
                        <span className="stat-label">Sent Individually</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">
                          {sentReports.filter(r => r.sentAsGroup).length}
                        </span>
                        <span className="stat-label">Sent as Groups</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="tab-content">
              <div className="form-container">
                <h3>Course Development & Management</h3>
                <p className="section-description">Submit course proposals for Program Leader review and approval.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit('courses', coursesData); }}>
                  <div className="form-group">
                    <label>Course Title:</label>
                    <select 
                      className="form-control"
                      value={coursesData.courseTitle}
                      onChange={(e) => setCoursesData({...coursesData, courseTitle: e.target.value})}
                      required
                    >
                      <option value="">Select Course Title</option>
                      {availableCourseTitles.map(title => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Course Description:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={coursesData.description}
                      onChange={(e) => setCoursesData({...coursesData, description: e.target.value})}
                      placeholder="Provide detailed course description and overview..."
                      rows="4"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Learning Objectives:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={coursesData.objectives}
                      onChange={(e) => setCoursesData({...coursesData, objectives: e.target.value})}
                      placeholder="List the learning objectives and outcomes students should achieve..."
                      rows="4"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Requirements & Prerequisites:</label>
                    <textarea 
                      className="form-control large-textarea"
                      value={coursesData.requirements}
                      onChange={(e) => setCoursesData({...coursesData, requirements: e.target.value})}
                      placeholder="Specify course requirements, prerequisites, and any necessary background knowledge..."
                      rows="3"
                      required
                    />
                  </div>

                  <div className="course-submission-notice">
                    <div className="notice-icon"></div>
                    <div className="notice-content">
                      <strong>Submission Process:</strong> This course proposal will be automatically sent to the Program Leader for review. 
                      You will be notified once the proposal is either approved or rejected.
                    </div>
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Submit Course Proposal to Program Leader
                  </button>
                </form>

                {/* Submitted Course Proposals */}
                {courseProposals.length > 0 && (
                  <div className="submitted-proposals-section">
                    <h4>Submitted Course Proposals</h4>
                    <p className="section-description">These proposals have been sent to the Program Leader for review.</p>
                    <div className="proposals-list">
                      {courseProposals.map(proposal => (
                        <div key={proposal.id} className="proposal-card">
                          <div className="proposal-header">
                            <div className="proposal-info">
                              <h5>{proposal.title}</h5>
                              <div className="proposal-meta">
                                <span className="proposal-date">Submitted: {proposal.date}</span>
                                <span className={`proposal-status ${proposal.status}`}>
                                  {proposal.status === 'pending' ? ' Under Review' : 
                                   proposal.status === 'approved' ? ' Approved' : 
                                   ' Rejected'}
                                </span>
                              </div>
                            </div>
                            <div className="proposal-actions">
                              <button 
                                className="delete-btn"
                                onClick={() => deleteCourseProposal(proposal.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          <div className="proposal-details">
                            <div className="detail-section">
                              <strong>Description:</strong>
                              <p>{proposal.description}</p>
                            </div>
                            <div className="detail-section">
                              <strong>Learning Objectives:</strong>
                              <p>{proposal.objectives}</p>
                            </div>
                            <div className="detail-section">
                              <strong>Requirements:</strong>
                              <p>{proposal.requirements}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .principal-lecturer-portal {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Top Navigation Styles */
        .top-nav {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
        }

        .nav-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .top-nav-menu {
          display: flex;
          padding: 0 2rem;
          background: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-btn {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          border-bottom: 3px solid transparent;
          white-space: nowrap;
          font-weight: 500;
        }

        .nav-btn:hover {
          background: #edf2f7;
          color: #2d3748;
        }

        .nav-btn.active {
          background: #3498db;
          color: white;
          border-bottom-color: #f39c12;
        }

        .logout-btn {
          margin-left: auto;
          padding: 1rem 1.5rem;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
          margin: 0.5rem;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        }

        .logout-btn:hover {
          background: #c0392b;
          transform: translateY(-1px);
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
        }

        .content-body {
          padding: 2rem;
          overflow-y: auto;
        }

        .section-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .section-header h1 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 2.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #2c3e50, #3498db, #2c3e50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-header p {
          color: #718096;
          margin: 0;
          font-size: 1.1rem;
        }

        .tab-content {
          animation: fadeInUp 0.5s ease-out;
        }

        .form-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          margin-top: 1.5rem;
        }

        .form-container h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
          border-bottom: 2px solid #3498db;
          padding-bottom: 0.5rem;
        }

        .section-description {
          color: #718096;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2d3748;
          font-size: 0.875rem;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
          background: white;
          font-family: inherit;
        }

        .form-control:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .large-textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.5;
        }

        .submit-btn {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
          background: linear-gradient(135deg, #2ecc71, #27ae60);
        }

        .submit-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Course Submission Notice */
        .course-submission-notice {
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .course-submission-notice .notice-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .course-submission-notice .notice-content {
          flex: 1;
          color: #1565c0;
          font-size: 0.95rem;
        }

        /* Submitted Proposals Section */
        .submitted-proposals-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e2e8f0;
        }

        .proposals-list {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .proposal-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .proposal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .proposal-info h5 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.2em;
        }

        .proposal-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .proposal-date {
          font-size: 0.85em;
          color: #718096;
        }

        .proposal-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 600;
        }

        .proposal-status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .proposal-status.approved {
          background: #d4edda;
          color: #155724;
        }

        .proposal-status.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .proposal-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .proposal-details {
          margin-top: 1rem;
        }

        .detail-section {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .detail-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .detail-section strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .detail-section p {
          margin: 0;
          color: #5d6d7e;
          line-height: 1.5;
        }

        /* Individual Reports Section */
        .individual-reports-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .report-selection-item {
          background: #f8f9fa;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .report-selection-item:hover {
          border-color: #3498db;
          background: #f1f8ff;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .report-info {
          flex: 1;
        }

        .report-info strong {
          display: block;
          margin-bottom: 0.25rem;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .report-date, .report-status {
          font-size: 0.85em;
          color: #718096;
          margin-right: 0.5rem;
        }

        .report-status.available {
          color: #27ae60;
          font-weight: 600;
        }

        .report-status.sent {
          color: #3498db;
          font-weight: 600;
        }

        .report-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .send-individual-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
          transition: background 0.3s;
        }

        .send-individual-btn:hover {
          background: #2980b9;
        }

        .send-group-btn {
          background: #9b59b6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95em;
          font-weight: 600;
          transition: background 0.3s;
        }

        .send-group-btn:hover {
          background: #8e44ad;
        }

        .sent-indicator {
          color: #27ae60;
          font-size: 0.85em;
          font-weight: 600;
        }

        .report-preview {
          border-top: 1px solid #e2e8f0;
          padding-top: 0.75rem;
        }

        .report-preview p {
          margin: 0.25rem 0;
          font-size: 0.9em;
          color: #5d6d7e;
        }

        /* Group Reports Sections */
        .group-reports-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .grouped-reports-section {
          margin-bottom: 2rem;
        }

        .no-reports-message {
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          color: #6c757d;
        }

        .view-all-notice {
          text-align: center;
          margin-top: 1rem;
          padding: 1rem;
          background: #e3f2fd;
          border-radius: 6px;
          color: #1565c0;
        }

        /* Checkbox Styles */
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
          width: 100%;
        }

        .checkbox-input {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #bdc3c7;
          border-radius: 4px;
          margin-right: 12px;
          margin-top: 2px;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-input:checked + .checkmark {
          background: #3498db;
          border-color: #3498db;
        }

        .checkbox-input:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          color: white;
          font-size: 14px;
          font-weight: bold;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .checkbox-input:disabled + .checkmark {
          background: #ecf0f1;
          border-color: #bdc3c7;
          cursor: not-allowed;
        }

        /* Generated Reports Section */
        .generated-reports-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e2e8f0;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .report-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 600;
        }

        .status-badge.generated {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.sent {
          background: #d4edda;
          color: #155724;
        }

        .report-details p {
          margin: 0.25rem 0;
          font-size: 0.9em;
          color: #5d6d7e;
        }

        .report-sent-info {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #d4edda;
          border-radius: 4px;
          color: #155724;
          font-size: 0.85em;
          text-align: center;
        }

        /* Grouped Reports List */
        .grouped-reports-list {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .grouped-report-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .group-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .group-info h5 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.2em;
        }

        .group-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .priority-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 600;
        }

        .priority-badge.low { background: #d4edda; color: #155724; }
        .priority-badge.medium { background: #fff3cd; color: #856404; }
        .priority-badge.high { background: #f8d7da; color: #721c24; }
        .priority-badge.urgent { background: #721c24; color: white; }

        .report-count, .group-date {
          font-size: 0.85em;
          color: #718096;
        }

        .group-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .sent-badge {
          background: #27ae60;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85em;
          font-weight: 600;
        }

        .delete-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
          transition: background 0.3s;
        }

        .delete-btn:hover {
          background: #c0392b;
        }

        .group-summary {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          border-left: 3px solid #3498db;
        }

        .included-reports {
          margin-top: 1rem;
        }

        .reports-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .included-report {
          background: white;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.85em;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .report-title {
          font-weight: 500;
        }

        .individual-sent-indicator {
          color: #27ae60;
          font-size: 0.8em;
          font-weight: 600;
        }

        /* Sent Reports Summary */
        .sent-reports-summary {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #e8f5e8;
          border-radius: 8px;
          border: 1px solid #c8e6c9;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #27ae60;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9em;
          color: #718096;
        }

        /* Feedback Notice */
        .feedback-notice {
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .feedback-notice .notice-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .feedback-notice .notice-content {
          flex: 1;
          color: #1565c0;
          font-size: 0.95rem;
        }

        .portal-highlight {
          background: #2196f3;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          margin: 0 0.25rem;
        }

        .student-program-info {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: rgba(33, 150, 243, 0.1);
          border-radius: 4px;
          border-left: 3px solid #2196f3;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .content-body {
            padding: 1rem;
          }
          
          .nav-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .user-info {
            align-items: flex-start;
          }
          
          .top-nav-menu {
            flex-wrap: wrap;
            padding: 0 1rem;
          }
          
          .nav-btn {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }
          
          .section-header h1 {
            font-size: 1.8rem;
          }
          
          .form-container {
            padding: 1.5rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .reports-selection-grid {
            grid-template-columns: 1fr;
          }
          
          .group-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .group-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .feedback-notice {
            flex-direction: column;
            text-align: center;
          }

          .report-header {
            flex-direction: column;
            gap: 1rem;
          }

          .report-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .proposal-header {
            flex-direction: column;
            gap: 1rem;
          }

          .proposal-actions {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .top-nav-menu {
            flex-direction: column;
          }
          
          .logout-btn {
            margin-left: 0;
            margin-top: 0.5rem;
          }
          
          .section-header h1 {
            font-size: 1.5rem;
          }
          
          .section-header p {
            font-size: 1rem;
          }
          
          .reports-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PrincipalLecturer;