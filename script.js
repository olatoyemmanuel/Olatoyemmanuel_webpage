// Mobile Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
    this.querySelector('i').classList.toggle('fa-bars');
    this.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
        document.querySelector('.menu-toggle i').classList.remove('fa-times');
        document.querySelector('.menu-toggle i').classList.add('fa-bars');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Three.js Blockchain Visualization
let scene, camera, renderer, particles = [];

function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('three-bg').appendChild(renderer.domElement);
    
    // Create particle system
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00D4FF,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Create connecting lines
    createConnections();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

function createConnections() {
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00D4FF,
        transparent: true,
        opacity: 0.2
    });
    
    const positions = particles.geometry.attributes.position.array;
    
    // Create lines between some particles
    for(let i = 0; i < positions.length; i += 9) {
        if(Math.random() > 0.7) {
            const startIndex = Math.floor(Math.random() * positions.length / 3) * 3;
            const endIndex = Math.floor(Math.random() * positions.length / 3) * 3;
            
            const points = [];
            points.push(new THREE.Vector3(
                positions[startIndex],
                positions[startIndex + 1],
                positions[startIndex + 2]
            ));
            
            points.push(new THREE.Vector3(
                positions[endIndex],
                positions[endIndex + 1],
                positions[endIndex + 2]
            ));
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    
    // Pulsing effect
    const time = Date.now() * 0.001;
    particles.material.opacity = 0.4 + 0.2 * Math.sin(time * 0.5);
    
    renderer.render(scene, camera);
}

// Initialize Three.js when page loads
window.addEventListener('load', initThreeJS);

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if(window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(10, 11, 14, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.backgroundColor = 'rgba(10, 11, 14, 0.9)';
    }
});

// Add animation to stats when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(statValue => {
                const finalValue = statValue.textContent;
                if (finalValue.includes('+')) {
                    animateCounter(statValue, 0, parseInt(finalValue), 1500);
                }
            });
        }
    });
}, observerOptions);

// Observe stats section
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Counter animation function
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + "+";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Methodology Section Animations
const methodologyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const steps = entry.target.querySelectorAll('.methodology-step');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.style.opacity = '1';
                    step.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    });
}, { threshold: 0.3 });

// Observe methodology section
const methodologySection = document.querySelector('.methodology-steps');
if (methodologySection) {
    // Set initial state for animation
    const steps = document.querySelectorAll('.methodology-step');
    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    methodologyObserver.observe(methodologySection);
}

// Add hover effect to severity levels
const severityLevels = document.querySelectorAll('.severity-level');
severityLevels.forEach(level => {
    level.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.03)';
    });
    
    level.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add pulse animation to methodology step icons on hover
const stepIcons = document.querySelectorAll('.step-icon');
stepIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.5s ease';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.animation = '';
    });
});

// Add click to expand functionality for methodology steps
const methodologySteps = document.querySelectorAll('.methodology-step');
methodologySteps.forEach(step => {
    step.addEventListener('click', function() {
        this.classList.toggle('expanded');
        const content = this.querySelector('.step-content p');
        if (this.classList.contains('expanded')) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
        } else {
            content.style.maxHeight = '60px';
            content.style.opacity = '0.8';
        }
    });
});
            // PDF Generation for Project Documentation
           function generatePDF() {
            // This function would be implemented based on your PDF library choice
    // You can use jsPDF or simply link to the HTML page that generates PDF
            window.open('cross-chain-bridge-documentation.html', '_blank');
            return false;
}
// PDF Generation for Audit Report
function generateAuditPDF() {
    window.open('nft-marketplace-audit-report.html', '_blank');
    return false;
}
// PDF Generation for DeFi Protocol
function generateProtocolPDF() {
    window.open('securedfi-lending-protocol.html', '_blank');
    return false;
}
