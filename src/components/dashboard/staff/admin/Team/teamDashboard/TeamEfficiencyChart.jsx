/* eslint-disable react/prop-types */
"use client"

import { useEffect, useRef } from "react"

const TeamEfficiencyChart = ({ teams, dateRange }) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!teams || !teams.length || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Chart dimensions
        const padding = 40
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2
        const barWidth = Math.min(40, chartWidth / teams.length - 20)

        // Draw axes
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.strokeStyle = "#CBD5E0"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw horizontal grid lines
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
        ctx.font = "12px sans-serif"
        ctx.fillStyle = "#718096"

        for (let i = 0; i <= 10; i++) {
            const y = canvas.height - padding - i * (chartHeight / 10)

            ctx.beginPath()
            ctx.moveTo(padding, y)
            ctx.lineTo(canvas.width - padding, y)
            ctx.strokeStyle = "#EDF2F7"
            ctx.lineWidth = 1
            ctx.stroke()

            // Draw y-axis labels
            ctx.fillText(`${i * 10}%`, padding - 10, y)
        }

        // Draw bars
        teams.forEach((team, index) => {
            const x = padding + index * (chartWidth / teams.length) + chartWidth / teams.length / 2 - barWidth / 2

            // Efficiency bar
            const efficiencyHeight = (team.efficiency / 100) * chartHeight
            ctx.fillStyle = getEfficiencyColor(team.exfficiency)
            ctx.fillRect(x, canvas.height - padding - efficiencyHeight, barWidth, efficiencyHeight)

            // Draw team name
            ctx.save()
            ctx.translate(x + barWidth / 2, canvas.height - padding + 10)
            ctx.rotate(-Math.PI / 4)
            ctx.textAlign = "right"
            ctx.fillStyle = "#4A5568"
            ctx.font = "12px sans-serif"
            ctx.fillText(team.name, 0, 0)
            ctx.restore()

            // Draw efficiency value
            ctx.fillStyle = "#2D3748"
            ctx.font = "bold 12px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(`${team.efficiency}%`, x + barWidth / 2, canvas.height - padding - efficiencyHeight - 15)
        })

        // Draw chart title
        ctx.fillStyle = "#2D3748"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Team Efficiency Comparison", canvas.width / 2, 20)
    }, [teams, dateRange])

    // Helper function to get color based on efficiency
    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 90) return "#48BB78" // green
        if (efficiency >= 70) return "#4299E1" // blue
        if (efficiency >= 50) return "#ECC94B" // yellow
        return "#F56565" // red
    }

    return (
        <div className="w-full h-[300px] mb-6">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    )
}

export default TeamEfficiencyChart
