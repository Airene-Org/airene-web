<script lang="ts">
    import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "$lib/components/ui/card";
    import { Table, TableCell, TableRow, TableHead, TableHeader, TableBody, TableCaption } from "$lib/components/ui/table";
    import { slide } from "svelte/transition";
    import { cubicOut } from "svelte/easing"
    import { Separator } from "$lib/components/ui/separator";
    import { Atom, CalendarClock, Car, GaugeCircle, LandPlot, Truck, Wind } from "lucide-svelte";

    type Data = {
        id: string;
        timestamp: string;
        latitude: number;
        longitude: number;
        aqi: number;
        v85: number;
        car: number;
        heavy: number;
        currentPm2_5: number;
        currentPm10: number;
    };
    export let data: Data;

    $: date = new Date(data.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    });
</script>

<div in:slide={{ easing: cubicOut }}>
    <Card class="mx-auto my-5">
        <CardHeader>
            <CardTitle>Anomaly details</CardTitle>
            <CardDescription>
                at {date}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableCaption>The details of the recorded anomaly</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead />
                        <TableHead>Name</TableHead>
                        <TableHead>Reading</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell><LandPlot size={20} /></TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell class="flex gap-2">
                            <p>
                                {data.latitude} {data.latitude > 0 ? "N" : "S"}
                            </p>
                            <Separator class="" orientation="vertical" />
                            <p>
                                {data.longitude} {data.longitude > 0 ? "E" : "W"}
                            </p>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><CalendarClock size={20} /></TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>{date}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Wind size={20} /></TableCell>
                        <TableCell>AQI</TableCell>
                        <TableCell>{data.aqi.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><GaugeCircle size={20} /></TableCell>
                        <TableCell>85th percentile Speed</TableCell>
                        <TableCell>{data.v85.toFixed(2)} km/h</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Car size={20} /></TableCell>
                        <TableCell>Cars</TableCell>
                        <TableCell>{data.car.toFixed(0)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Truck size={20} /></TableCell>
                        <TableCell>Trucks</TableCell>
                        <TableCell>{data.heavy.toFixed(0)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Atom size={20} /></TableCell>
                        <TableCell>PM2.5</TableCell>
                        <TableCell>{data.currentPm2_5.toFixed(2)} μg/m³</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Atom size={20} /></TableCell>
                        <TableCell>PM10</TableCell>
                        <TableCell>{data.currentPm10.toFixed(2)} μg/m³</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</div>
