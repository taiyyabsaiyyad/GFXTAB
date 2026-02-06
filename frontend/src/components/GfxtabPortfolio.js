import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactForm from './ContactForm';

gsap.registerPlugin(ScrollTrigger);

const GfxtabPortfolio = () => {
  const canvasRef = useRef(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const projects = [
    { title: 'Neon 3D Orb', category: '3D Design', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200', folder: '#' },
    { title: 'City Manipulation', category: 'Photo Manipulation', image: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1200', folder: '#' },
    { title: 'Motion Graphics Reel', category: 'Motion Design', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200', folder: '#' },
    { title: 'Logo Design', category: 'Brand Identity', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200', folder: '#' },
    { title: 'Digital Invite', category: 'Design', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200', folder: '#' },
    { title: 'VFX Compositing', category: 'Visual Effects', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200', folder: '#' }
  ];

  const scrollToSection = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    
    scene.background = new THREE.Color(0x000008);
    scene.fog = new THREE.FogExp2(0x000008, 0.00025);
    
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.set(0, 0, 400);

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ENHANCED LIGHTING
    const ambientLight = new THREE.AmbientLight(0x505080, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3.5, 2500);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x00ddff, 2.5, 2000);
    blueLight.position.set(600, 200, -600);
    scene.add(blueLight);

    const magentaLight = new THREE.PointLight(0xff00ff, 2.5, 2000);
    magentaLight.position.set(-600, -200, -600);
    scene.add(magentaLight);

    // ULTRA HD SPIRAL GALAXY
    const createHDGalaxy = () => {
      const geometry = new THREE.BufferGeometry();
      const count = 8000; // Reduced for better performance
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 1000 + 300;
        const spinAngle = radius * 0.004;
        const branchAngle = ((i % 6) / 6) * Math.PI * 2; // 6 branches instead of 8
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 80;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 80;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 80;
        
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 1500;
        
        const colorInside = new THREE.Color('#00ffff');
        const colorMiddle = new THREE.Color('#0088ff');
        const colorOutside = new THREE.Color('#ff00ff');
        
        const mixedColor = colorInside.clone();
        if (radius < 600) {
          mixedColor.lerp(colorMiddle, radius / 600);
        } else {
          mixedColor.set(colorMiddle);
          mixedColor.lerp(colorOutside, (radius - 600) / 400);
        }
        
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
        
        sizes[i] = Math.random() * 8 + 3; // Larger particles compensate for fewer count
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const material = new THREE.PointsMaterial({
        size: 6,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      return new THREE.Points(geometry, material);
    };

    const galaxy = createHDGalaxy();
    scene.add(galaxy);

    // VOLUMETRIC NEBULA CLOUDS
    const createVolumetricNebula = (x, y, z, size, color1, color2) => {
      const group = new THREE.Group();
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.SphereGeometry(size * (1 - i * 0.2), 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? color1 : color2,
          transparent: true,
          opacity: 0.08 - i * 0.02,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * size * 0.3,
          (Math.random() - 0.5) * size * 0.3,
          (Math.random() - 0.5) * size * 0.3
        );
        group.add(mesh);
      }
      
      group.position.set(x, y, z);
      return group;
    };

    const nebulas = [];
    nebulas.push(createVolumetricNebula(250, 150, -500, 250, 0xff0088, 0xff00ff));
    nebulas.push(createVolumetricNebula(-300, -120, -800, 300, 0x00ffff, 0x0088ff));
    nebulas.push(createVolumetricNebula(200, -150, -1100, 350, 0x8800ff, 0xff0088));
    nebulas.push(createVolumetricNebula(-250, 180, -1400, 320, 0x00ff88, 0x00ffff));
    nebulas.forEach(n => scene.add(n));

    // HD STAR FIELD
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 4000; // Reduced from 12000 for better performance
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 4000;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 3000;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 4000;
      
      const starType = Math.random();
      if (starType < 0.25) {
        starColors[i3] = 0.4 + Math.random() * 0.6;
        starColors[i3 + 1] = 0.7 + Math.random() * 0.3;
        starColors[i3 + 2] = 1;
      } else if (starType < 0.5) {
        starColors[i3] = 1;
        starColors[i3 + 1] = 0.9 + Math.random() * 0.1;
        starColors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (starType < 0.75) {
        starColors[i3] = 1;
        starColors[i3 + 1] = 0.5 + Math.random() * 0.3;
        starColors[i3 + 2] = 0.3 + Math.random() * 0.4;
      } else {
        starColors[i3] = 1;
        starColors[i3 + 1] = 0.3 + Math.random() * 0.3;
        starColors[i3 + 2] = 0.8 + Math.random() * 0.2;
      }
      
      starSizes[i] = Math.random() * 6 + 2; // Slightly larger stars
    }
    
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starsGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    const starsMat = new THREE.PointsMaterial({
      size: 5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // REALISTIC PLANETS
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(50, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x2255ff,
        emissive: 0x003388,
        emissiveIntensity: 0.4,
        shininess: 40,
        specular: 0x4488ff
      })
    );
    earth.position.set(-250, -80, -500);
    scene.add(earth);

    const earthGlow = new THREE.Mesh(
      new THREE.SphereGeometry(53, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      })
    );
    earth.add(earthGlow);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(12, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        emissive: 0x555555,
        shininess: 10
      })
    );
    moon.position.set(-180, -80, -450);
    scene.add(moon);

    const saturn = new THREE.Mesh(
      new THREE.SphereGeometry(60, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0xffcc88,
        emissive: 0x886644,
        emissiveIntensity: 0.3,
        shininess: 25
      })
    );
    saturn.position.set(-500, 150, -1400);
    scene.add(saturn);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(70, 110, 64),
      new THREE.MeshBasicMaterial({
        color: 0xffddaa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      })
    );
    ring.rotation.x = Math.PI / 2.3;
    saturn.add(ring);

    // CINEMATIC CAMERA PATH
    let targetZ = 400;
    let targetY = 0;
    let targetRotY = 0;

    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        targetZ = 400 - (progress * 2500);
        targetY = Math.sin(progress * Math.PI * 4) * 120;
        targetRotY = progress * Math.PI * 0.25;
      }
    });

    // SMOOTH ANIMATION
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.008;
      
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;
      
      galaxy.rotation.y += 0.0002;
      galaxy.rotation.z += 0.0001;
      
      nebulas.forEach((nebula, i) => {
        nebula.rotation.y += 0.0001 * (i + 1);
        nebula.rotation.x += 0.00005 * (i + 1);
        nebula.children.forEach((child, j) => {
          child.scale.setScalar(1 + Math.sin(time * (i + 1) + j) * 0.08);
        });
      });
      
      earth.rotation.y += 0.0025;
      saturn.rotation.y += 0.0012;
      
      moon.position.x = earth.position.x + Math.cos(time * 0.6) * 100;
      moon.position.z = earth.position.z + Math.sin(time * 0.6) * 100;
      
      stars.rotation.y += 0.00008;
      
      blueLight.intensity = 2.5 + Math.sin(time * 1.2) * 0.6;
      magentaLight.intensity = 2.5 + Math.cos(time * 1.5) * 0.6;
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    // Hero content animation with explicit fromTo
    gsap.fromTo('.universe-hero-content > *', 
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.3 }
    );

    // Section animations on scroll
    const sections = [
      '.universe-proof',
      '.universe-work',
      '.universe-positioning',
      '.universe-capabilities',
      '.universe-founder',
      '.universe-process',
      '.universe-platforms',
      '.universe-cta'
    ];

    sections.forEach((selector) => {
      gsap.fromTo(selector, 
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: selector,
            start: 'top 85%',
            end: 'top 40%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Project cards animation
    gsap.fromTo('.universe-project-card', 
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.universe-work-grid',
          start: 'top 80%'
        }
      }
    );
  }, []);

  return (
    <div className="universe-portfolio">
      <canvas ref={canvasRef} className="universe-canvas" />
      
      {/* NAVIGATION */}
      <nav className="universe-nav">
        <div className="universe-nav-content">
          <div className="universe-logo">GFXTAB</div>
          
          <button className="universe-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className={`universe-nav-links ${menuOpen ? 'open' : ''}`}>
            <a onClick={() => scrollToSection('home')}>Home</a>
            <a onClick={() => scrollToSection('workSection')}>Work</a>
            <a onClick={() => scrollToSection('aboutSection')}>About</a>
            <a onClick={() => scrollToSection('processSection')}>Process</a>
            <a onClick={() => setShowContactForm(true)}>Contact</a>
          </div>
        </div>
      </nav>
      
      <div className="universe-content">
        {/* HERO */}
        <section className="universe-hero" id="home" data-testid="hero-section">
          <div className="universe-hero-content">
            <div className="universe-brand" data-testid="brand-mark">GFXTAB</div>
            <h1 className="universe-title" data-testid="hero-headline">
              We Design Visual Experiences<br/>That Define Modern Brands
            </h1>
            <p className="universe-subtitle" data-testid="hero-subline">
              Journey through the cosmos of creativity where imagination meets execution in a stellar dance of design.
            </p>
            <div className="universe-tagline" data-testid="hero-power-statement">
              Premium by design. Strategic by intention.
            </div>
            <div className="universe-buttons">
              <button 
                className="universe-btn-primary" 
                data-testid="start-project-btn-hero"
                onClick={() => setShowContactForm(true)}
              >
                <span>Start a Project</span>
              </button>
              <button 
                className="universe-btn-secondary" 
                data-testid="view-work-btn"
                onClick={() => scrollToSection('workSection')}
              >
                <span>View Selected Work</span>
              </button>
            </div>
          </div>
        </section>

        {/* PROOF */}
        <section className="universe-proof" data-testid="proof-strip">
          <div className="universe-proof-item">
            <div className="universe-proof-num">120+</div>
            <div className="universe-proof-label">Projects Delivered</div>
          </div>
          <div className="universe-divider"></div>
          <div className="universe-proof-item">
            <div className="universe-proof-num">4+</div>
            <div className="universe-proof-label">Years Expertise</div>
          </div>
          <div className="universe-divider"></div>
          <div className="universe-proof-item">
            <div className="universe-proof-num">Studio-Level</div>
            <div className="universe-proof-label">Execution</div>
          </div>
        </section>

        {/* WORK */}
        <section className="universe-work" id="workSection" data-testid="work-section">
          <div className="universe-section-header">
            <h2 className="universe-section-title" data-testid="work-title">Selected Work</h2>
            <p className="universe-section-sub">
              A refined selection of projects demonstrating strategic thinking, modern aesthetics, and meticulous execution.
            </p>
          </div>
          
          <div className="universe-work-grid">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="universe-project-card" 
                data-testid={`project-card-${index}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="universe-project-img">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="universe-project-overlay">
                    <span>View Project</span>
                  </div>
                </div>
                <div className="universe-project-info">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POSITIONING */}
        <section className="universe-positioning" id="aboutSection" data-testid="positioning-section">
          <h2 className="universe-section-title">Built for Brands That Intend to Lead</h2>
          <div className="universe-positioning-content">
            <p>We partner with ambitious businesses and emerging brands to craft visuals that influence perception and accelerate growth.</p>
            <p>Every detail is deliberate. Every design serves a purpose.</p>
            <p className="universe-closer">Not decoration. Direction.</p>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="universe-capabilities" data-testid="capabilities-section">
          <h2 className="universe-section-title">Capabilities</h2>
          <div className="universe-cap-grid">
            {[
              { title: 'Brand Identity', desc: 'Strategic visual systems designed for recognition and long-term brand equity.' },
              { title: 'Motion Design', desc: 'Cinematic visuals engineered to capture attention in fast-moving digital spaces.' },
              { title: 'Digital Creatives', desc: 'Modern, conversion-aware design tailored for today platforms.' },
              { title: 'Photo Manipulation', desc: 'High-detail compositions that transform concepts into powerful visuals.' }
            ].map((cap, i) => (
              <div key={i} className="universe-cap-item">
                <div className="universe-cap-icon"></div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER */}
        <section className="universe-founder" data-testid="founder-section">
          <div className="universe-founder-logo">
            <img 
              src="https://drive.google.com/uc?export=view&id=1sMjejBtmc5If2PABfdaWv35U3duIu57h" 
              alt="GFXTAB"
            />
          </div>
          <h2 className="universe-section-title">Founder-Led. Detail-Obsessed.</h2>
          <div className="universe-founder-content">
            <p>GFXTAB was founded by <strong>Taiyyab Saiyyad</strong>, a visual designer known for blending strategic clarity with striking aesthetics.</p>
            <p>With over four years of professional experience, his work reflects a commitment to precision, modern design language, and results-driven creativity.</p>
          </div>
        </section>

        {/* PROCESS */}
        <section className="universe-process" id="processSection" data-testid="process-section">
          <h2 className="universe-section-title">Process</h2>
          <div className="universe-process-grid">
            {[
              { num: '01', title: 'Discover', desc: 'Understanding your brand, audience, and objectives.' },
              { num: '02', title: 'Define', desc: 'Translating insights into clear creative direction.' },
              { num: '03', title: 'Design', desc: 'Crafting visuals with precision and intention.' },
              { num: '04', title: 'Refine', desc: 'Polishing every detail until it meets studio standards.' },
              { num: '05', title: 'Deliver', desc: 'Production-ready assets built for impact.' }
            ].map((step, i) => (
              <div key={i} className="universe-process-step">
                <div className="universe-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PLATFORMS */}
        <section className="universe-platforms" data-testid="platforms-section">
          <h2 className="universe-section-title">Professional Platforms</h2>
          <div className="universe-platforms-grid">
            {[
              { name: 'Behance', desc: 'Portfolio & Case Studies', url: 'https://www.behance.net/taiyyabsaiyyad1', testid: 'behance-link' },
              { name: 'Instagram', desc: 'Creative Showcase', url: 'https://www.instagram.com/gfxtab', testid: 'instagram-link' },
              { name: 'LinkedIn', desc: 'Professional Journey', url: 'https://www.linkedin.com/in/taiyyab-saiyyad-031887192', testid: 'linkedin-link' }
            ].map((platform, i) => (
              <a 
                key={i}
                href={platform.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="universe-platform-card"
                data-testid={platform.testid}
              >
                <h3>{platform.name}</h3>
                <p>{platform.desc}</p>
                <div className="universe-platform-arrow">→</div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="universe-cta" data-testid="final-cta">
          <h2 className="universe-cta-title">Let's Create Something Remarkable</h2>
          <p className="universe-cta-text">
            Whether you are launching a brand, elevating your presence, or redefining your visual identity, the right design can transform perception.
          </p>
          <button 
            className="universe-btn-primary-large" 
            data-testid="start-project-btn-cta"
            onClick={() => setShowContactForm(true)}
          >
            <span>Start a Project</span>
          </button>
          <p className="universe-cta-notice">Currently accepting select projects</p>
        </section>

        {/* FOOTER */}
        <footer className="universe-footer" data-testid="footer">
          <p>© 2025 GFXTAB — Crafted by Taiyyab Saiyyad</p>
        </footer>
      </div>

      {/* MODALS */}
      {selectedProject && (
        <div className="universe-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="universe-modal" onClick={(e) => e.stopPropagation()}>
            <button className="universe-modal-close" onClick={() => setSelectedProject(null)}>×</button>
            <div className="universe-modal-img">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="universe-modal-details">
              <div>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.category}</p>
              </div>
              <a href={selectedProject.folder} target="_blank" rel="noopener noreferrer" className="universe-btn-small">
                Open Folder
              </a>
            </div>
          </div>
        </div>
      )}

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
};

export default GfxtabPortfolio;
