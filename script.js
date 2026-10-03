const canvas = document.getElementById("MyCanvas")
const scale = 3
canvas.width = Math.ceil(window.innerWidth / scale)
canvas.height = Math.ceil(window.innerHeight / scale)

const ctx = canvas.getContext("2d")

const margin = 27
const turn = 0.05
const spacing = 3

const widths = [2, 3, 3.5, 3.5, 3, 2.5, 2, 1.5, 1, 0.7]
const palette = [
    "#ffb3b5", // light pink
    "#ff8a8c", // salmon pink
    "#e8607c", // medium pink
    "#ff4d4f", // --red
    "#d93235", // strong red
    "#b3191c", // --red-deep
    "#a8385a", // dark pink
    "#8a1417", // dark red
    "#5c0f11", // --red-dark
]



class Fish {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        this.angle = angle
        this.speed = 0.35
        this.segments = []
        this.color = palette[Math.floor(Math.random() * palette.length)]
        for (let i = 0; i < 10; i++) {
            this.segments.push({x: x, y: y})
        }
    }

    update() {
        this.angle += (Math.random() - 0.5) *0.2
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        if (this.x < margin || this.x > canvas.width - margin || this.y < margin || this.y > canvas.height - margin) {
            this.angle += turn
        }

        this.segments[0].x = this.x
        this.segments[0].y = this.y

        for (let i = 1; i < this.segments.length; i++) {
            const leader = this.segments[i - 1]
            const seg = this.segments[i]

            const dx = leader.x - seg.x
            const dy = leader.y - seg.y

            const direction = Math.atan2(dy, dx)

            seg.x = leader.x - Math.cos(direction) * spacing
            seg.y = leader.y - Math.sin(direction) * spacing
        }
    } 

    draw() {
        for (let i = 0; i < this.segments.length; i++) {
            ctx.beginPath()
            ctx.arc(this.segments[i].x,this.segments[i].y, widths[i], 0, Math.PI * 2)
            ctx.fillStyle = this.color
            ctx.fill()
        }
    }
}

const school = []
for (let i = 0; i < 5; i++) {
    const newX = Math.random() * canvas.width
    const newY = Math.random() * canvas.height
    const angle = Math.random() * Math.PI * 2
    school.push(new Fish(newX, newY, angle))
}


function loop() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < school.length; i++) {
        school[i].update()
        school[i].draw()
    }


    requestAnimationFrame(loop)
}

loop()