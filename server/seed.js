const Department = require('./models/Department');
const User = require('./models/User');
const Club = require('./models/Club');

const departments = [
  { name: 'Computer Science', description: 'Technology and computing department', color: '#3B82F6' },
  { name: 'Engineering', description: 'Engineering and applied sciences', color: '#F59E0B' },
  { name: 'Arts & Humanities', description: 'Creative arts and humanities', color: '#EC4899' },
  { name: 'Business Administration', description: 'Business and management studies', color: '#10B981' },
  { name: 'Natural Sciences', description: 'Physics, Chemistry, Biology and more', color: '#6366F1' },
  { name: 'Social Sciences', description: 'Psychology, Sociology, Political Science', color: '#F97316' }
];

async function seedDatabase() {
  try {
    const deptCount = await Department.countDocuments();
    let depts = [];

    if (deptCount === 0) {
      depts = await Department.insertMany(departments);
      console.log('Departments seeded');
    } else {
      depts = await Department.find();
    }

    const adminExists = await User.findOne({ role: 'super_admin' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@university.edu',
        password: 'admin123456',
        role: 'super_admin'
      });
      console.log('Super admin created: admin@university.edu / admin123456');
    }

    const clubCount = await Club.countDocuments();
    if (clubCount === 0 && depts.length > 0) {
      const csDept = depts.find(d => d.name === 'Computer Science');
      const artsDept = depts.find(d => d.name === 'Arts & Humanities');
      const engDept = depts.find(d => d.name === 'Engineering');
      const bizDept = depts.find(d => d.name === 'Business Administration');
      const sciDept = depts.find(d => d.name === 'Natural Sciences');

      await Club.insertMany([
        {
          name: 'CodeCraft Society',
          shortDescription: 'Build, learn, and collaborate on software projects.',
          description: 'CodeCraft Society is where passionate programmers gather to build real-world software, participate in hackathons, and push boundaries of technology. Open to all skill levels.',
          department: csDept?._id,
          category: 'technology',
          requirements: 'Basic programming knowledge. Enthusiasm to learn and collaborate.',
          maxMembers: 60,
          foundedYear: 2019,
          coverImage: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          name: 'AI & Machine Learning Club',
          shortDescription: 'Exploring the frontiers of artificial intelligence.',
          description: 'Dive deep into AI, machine learning, and data science with hands-on projects, guest speakers from industry, and competitions. We welcome curious minds eager to shape the future.',
          department: csDept?._id,
          category: 'technology',
          requirements: 'Python basics and calculus knowledge preferred.',
          maxMembers: 40,
          foundedYear: 2021,
          coverImage: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          name: 'Theatre Arts Guild',
          shortDescription: 'Where stories come alive on stage.',
          description: 'The Theatre Arts Guild produces full-length plays, student-written scripts, and experimental performances. We offer workshops in acting, directing, set design, and playwriting.',
          department: artsDept?._id,
          category: 'arts',
          requirements: 'Passion for performance. No prior experience necessary.',
          maxMembers: 45,
          foundedYear: 2005,
          coverImage: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          name: 'Photography Circle',
          shortDescription: 'Capture moments, tell stories through the lens.',
          description: 'Explore the art of photography from composition and lighting to darkroom techniques and digital editing. Monthly exhibitions and field shoots across the campus and city.',
          department: artsDept?._id,
          category: 'arts',
          requirements: 'Own or have access to a camera (DSLR or smartphone).',
          maxMembers: 35,
          foundedYear: 2015,
          coverImage: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          name: 'Robotics & Innovation Lab',
          shortDescription: 'Engineering tomorrow\'s solutions today.',
          description: 'Design, build, and program robots for national competitions and real-world problem solving. From autonomous vehicles to industrial automation, we tackle it all.',
          department: engDept?._id,
          category: 'technology',
          requirements: 'Engineering or CS background. Soldering experience is a plus.',
          maxMembers: 30,
          foundedYear: 2017,
          coverImage: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          name: 'Entrepreneurship Hub',
          shortDescription: 'Turn your ideas into impactful businesses.',
          description: 'The Entrepreneurship Hub connects aspiring founders with mentors, investors, and resources. We host pitch competitions, startup workshops, and networking events throughout the year.',
          department: bizDept?._id,
          category: 'academic',
          requirements: 'Passion for innovation and business. Open to all departments.',
          maxMembers: 80,
          foundedYear: 2016,
          coverImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          name: 'Debate & Public Speaking',
          shortDescription: 'Master the art of persuasion and rhetoric.',
          description: 'Sharpen your analytical thinking and communication skills through competitive debates, mock trials, and public speaking workshops. Members compete at regional and national levels.',
          department: artsDept?._id,
          category: 'academic',
          requirements: 'Strong interest in argumentation and critical thinking.',
          maxMembers: 50,
          foundedYear: 2008,
          coverImage: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          name: 'Environmental Science Society',
          shortDescription: 'Championing sustainability and environmental awareness.',
          description: 'We run conservation projects, sustainability initiatives, and environmental research on campus. Collaborate with local NGOs and government bodies to create real environmental impact.',
          department: sciDept?._id,
          category: 'community',
          requirements: 'Passion for the environment. Open to all majors.',
          maxMembers: 60,
          foundedYear: 2013,
          coverImage: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ]);
      console.log('Sample clubs seeded');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

module.exports = { seedDatabase };
