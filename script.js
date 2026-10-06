const canvas = document.getElementById("MyCanvas")
const scale = 3
function resize() {
    canvas.width = Math.ceil(window.innerWidth / scale)
    canvas.height = Math.ceil(window.innerHeight / scale)
}
resize()
const ctx = canvas.getContext("2d")

const margin = 50
const turn = 3
const spacing = 3

const widths = [2, 3, 3.5, 3.5, 3, 2.5, 2, 1.5, 1, 0.7]
const palette = [
    "#d5e0b5", // pale leaf
    "#bcd096", // light sage
    "#a7c080", // --accent
    "#8fb573", // spring green
    "#83c092", // mint
    "#7a9a5e", // moss
    "#6b8f71", // eucalyptus
    "#5a7a4a", // fern
    "#3f5a3a", // deep forest
]


class Fish {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        this.angle = angle
        this.speed = 30
        this.segments = []
        this.color = palette[Math.floor(Math.random() * palette.length)]
        for (let i = 0; i < 9; i++) {
            this.segments.push({x: x, y: y, angle: angle})
        }
    }

    update(dt) {
        this.angle += (Math.random() - 0.5) * 0.2 * Math.sqrt(dt * 60)
        this.x += Math.cos(this.angle) * this.speed * dt
        this.y += Math.sin(this.angle) * this.speed * dt

        if (this.x < margin || this.x > canvas.width - margin || this.y < margin || this.y > canvas.height - margin) {
            this.angle += turn * dt
        }

        this.segments[0].x = this.x
        this.segments[0].y = this.y
        this.segments[0].angle = this.angle

        for (let i = 1; i < this.segments.length; i++) {
            const leader = this.segments[i - 1]
            const seg = this.segments[i]

            const dx = leader.x - seg.x
            const dy = leader.y - seg.y

            const direction = Math.atan2(dy, dx)
            this.segments[i].angle = direction

            seg.x = leader.x - Math.cos(direction) * spacing
            seg.y = leader.y - Math.sin(direction) * spacing
        }
    } 

    draw() {
        this.drawFin(1)
        this.drawFin(-1)
        this.drawTail()
        for (let i = 0; i < this.segments.length; i++) {
            ctx.beginPath()
            ctx.arc(this.segments[i].x,this.segments[i].y, widths[i], 0, Math.PI * 2)
            ctx.fillStyle = this.color
            ctx.fill()
        }
    }

    drawFin(side) {
        const finSeg = this.segments[2]
        const finWidth = widths[2]
        const sideAngle = finSeg.angle + (Math.PI / 2 * side)

        const finX = finSeg.x + Math.cos(sideAngle) * finWidth
        const finY = finSeg.y + Math.sin(sideAngle) * finWidth

        ctx.beginPath()
        ctx.ellipse(finX, finY, 3.5, 1.8, finSeg.angle + 2 * side, 0, Math.PI * 2)
        ctx.fillStyle = "#d8d3c0"
        ctx.fill()
    }

    drawTail() {
        const spread = 0.5
        const length = 6
        const tail = this.segments[this.segments.length - 1]
        const backAngle = tail.angle + Math.PI

        const tip1X = tail.x + Math.cos(backAngle + spread) * length
        const tip1Y = tail.y + Math.sin(backAngle + spread) * length

        const tip2X = tail.x + Math.cos(backAngle - spread) * length
        const tip2Y = tail.y + Math.sin(backAngle - spread) * length

        ctx.beginPath()
        ctx.moveTo(tail.x, tail.y)
        ctx.lineTo(tip1X, tip1Y)
        ctx.lineTo(tip2X, tip2Y)
        ctx.closePath()
        ctx.fillStyle = "#d8d3c0"
        ctx.fill()
    }
}

const ripples = []

class Ripple {
    constructor(x, y, delay = 0) {
        this.x = x
        this.y = y
        this.age = -delay
        this.maxAge = 1.5
        this.maxRadius = 22
        this.noise = Array.from({ length: 64}, () => Math.random())
    }

    update(dt) {
        this.age += dt
    }

    get dead() {
        return this.age >= this.maxAge
    }

    draw() {
        if (this.age < 0) return

        const t = this.age / this.maxAge
        const radius = (1 - (1 - t) ** 2) * this.maxRadius
        const steps = Math.ceil(radius * 2 * Math.PI)
        const gap = 0.2 + t * 0.8

        ctx.fillStyle = "#d8d3c0"
        for (let i = 0; i < steps; i++) {
            const slot = Math.floor(i / steps * this.noise.length)
            if (this.noise[slot] < gap) continue

            const a = i / steps * Math.PI * 2
            const px = Math.round(this.x + Math.cos(a) * radius)
            const py = Math.round(this.y + Math.sin(a) * radius)
            ctx.fillRect(px, py, 1, 1)
        }

    }
}

window.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    for (let i = 0; i < 3; i++) {
        ripples.push(new Ripple(x, y, i * 0.25))
    }
})

const school = []
for (let i = 0; i < 15; i++) {
    const newX = Math.random() * canvas.width
    const newY = Math.random() * canvas.height
    const angle = Math.random() * Math.PI * 2
    school.push(new Fish(newX, newY, angle))
}

window.addEventListener("resize", () => {
    resize()
    for (const fish of school) {
        fish.x = Math.min(fish.x, canvas.width - margin)
        fish.y = Math.min(fish.y, canvas.height - margin)
    }
})

let last = 0

function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < school.length; i++) {
        school[i].update(dt)
        school[i].draw()

    }
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update(dt)
        ripples[i].draw()
        if (ripples[i].dead) ripples.splice(i, 1)
    }


    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)