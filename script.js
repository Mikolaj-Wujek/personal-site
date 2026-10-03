const canvas = document.getElementById("MyCanvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")

const margin = 80
const turn = 0.05
const spacing = 8


class Fish {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        this.angle = angle
        this.speed = 1
        this.segments = []
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
            ctx.arc(this.segments[i].x,this.segments[i].y, 10 - i, 0, Math.PI * 2)
            ctx.fillStyle = "red"
            ctx.fill()
        }
    }
}

const fish = new Fish(100, 100, 0)

function loop() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    fish.update()
    fish.draw()

    requestAnimationFrame(loop)
}

loop()