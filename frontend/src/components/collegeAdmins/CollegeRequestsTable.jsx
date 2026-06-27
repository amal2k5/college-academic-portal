import { Eye } from "lucide-react";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
        colors[status] || colors.PENDING
      }`}
    >
      {status}
    </span>
  );
};

const CollegeRequestsTable = ({
  loading,
  requests,
  onView,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-12 text-center text-neutral-400">
        Loading registration requests...
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-12 text-center">
        <h3 className="text-lg font-semibold text-white">
          No Requests Found
        </h3>

        <p className="mt-2 text-sm text-neutral-500">
          There are no college registration requests available.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="border-b border-neutral-800 bg-neutral-950">
            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                College
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Contact
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Submitted
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-neutral-800 transition hover:bg-neutral-800/40"
              >
                <td className="px-6 py-5">
                  <div className="font-medium text-white">
                    {request.college_name}
                  </div>
                </td>

                <td className="px-6 py-5 text-neutral-300">
                  {request.contact_person}
                </td>

                <td className="px-6 py-5 text-neutral-300">
                  {request.email}
                </td>

                <td className="px-6 py-5">
                  <StatusBadge status={request.status} />
                </td>

                <td className="px-6 py-5 text-neutral-400">
                  {new Date(
                    request.created_at
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-5 text-center">

                  <button
                    onClick={() => onView(request)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                  >
                    <Eye size={16} />
                    View
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </motion.div>
  );
};

export default CollegeRequestsTable;