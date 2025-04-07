
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MissionData } from "@/lib/mockData";
import StatusBadge from "@/components/common/StatusBadge";

interface MissionTableProps {
  missions: MissionData[];
}

const MissionTable = ({ missions }: MissionTableProps) => {
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Missions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mission Name</TableHead>
              <TableHead>Facility</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Drone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.name}</TableCell>
                <TableCell>{mission.facility}</TableCell>
                <TableCell>{formatDate(mission.startTime)}</TableCell>
                <TableCell>{mission.droneId || "Not assigned"}</TableCell>
                <TableCell>
                  <StatusBadge status={mission.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MissionTable;
