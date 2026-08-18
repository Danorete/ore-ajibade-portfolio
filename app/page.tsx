import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Experience } from '@/components/experience'
import { Projects } from '@/components/projects'
import { Skills } from '@/components/skills'
import { Education } from '@/components/education'
import { Hobbies } from '@/components/hobbies'
import { Resume } from '@/components/resume'
import { ContactFooter } from '@/components/contact-footer'

export default function Page() {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Hobbies />
        <Resume />
        <ContactFooter />
      </main>
    </div>
  )
}
